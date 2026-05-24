import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Property, PropertyStatus } from './property.entity';
import { PropertyImage } from './property-image.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UploadService } from '../upload/upload.service';

export interface PropertyFilters {
  status?: PropertyStatus;
  isFeatured?: boolean;
}

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(PropertyImage)
    private readonly imageRepository: Repository<PropertyImage>,
    private readonly uploadService: UploadService,
  ) {}

  findAll(filters: PropertyFilters = {}): Promise<Property[]> {
    const where: FindOptionsWhere<Property> = {};
    if (filters.status !== undefined) {
      where.status = filters.status;
    }
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    return this.propertyRepository.find({
      where,
      relations: { images: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: { images: true },
    });
    if (!property) {
      throw new NotFoundException(`Property ${id} not found`);
    }
    return property;
  }

  create(dto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(dto);
    return this.propertyRepository.save(property);
  }

  async update(id: string, dto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);
    Object.assign(property, dto);
    return this.propertyRepository.save(property);
  }

  async delete(id: string): Promise<void> {
    const property = await this.findOne(id);
    await Promise.all(
      property.images.map((image) =>
        this.uploadService.deleteImage(image.publicId),
      ),
    );
    await this.propertyRepository.remove(property);
  }

  async addImages(
    propertyId: string,
    files: Express.Multer.File[],
  ): Promise<PropertyImage[]> {
    const property = await this.findOne(propertyId);

    const saved: PropertyImage[] = [];
    for (const file of files) {
      const { url, publicId } = await this.uploadService.uploadImage(file);
      const image = this.imageRepository.create({ url, publicId, property });
      saved.push(await this.imageRepository.save(image));
    }
    return saved;
  }

  async deleteImage(imageId: string): Promise<void> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) {
      throw new NotFoundException(`Image ${imageId} not found`);
    }
    await this.uploadService.deleteImage(image.publicId);
    await this.imageRepository.remove(image);
  }
}
