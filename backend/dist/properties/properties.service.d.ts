import { Repository } from 'typeorm';
import { Property, PropertyStatus } from './property.entity';
import { PropertyImage } from './property-image.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UploadService } from '../upload/upload.service';
export interface PropertyFilters {
    status?: PropertyStatus;
    isFeatured?: boolean;
}
export declare class PropertiesService {
    private readonly propertyRepository;
    private readonly imageRepository;
    private readonly uploadService;
    constructor(propertyRepository: Repository<Property>, imageRepository: Repository<PropertyImage>, uploadService: UploadService);
    findAll(filters?: PropertyFilters): Promise<Property[]>;
    findOne(id: string): Promise<Property>;
    create(dto: CreatePropertyDto): Promise<Property>;
    update(id: string, dto: UpdatePropertyDto): Promise<Property>;
    delete(id: string): Promise<void>;
    addImages(propertyId: string, files: Express.Multer.File[]): Promise<PropertyImage[]>;
    deleteImage(imageId: string): Promise<void>;
}
