"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("./property.entity");
const property_image_entity_1 = require("./property-image.entity");
const upload_service_1 = require("../upload/upload.service");
let PropertiesService = class PropertiesService {
    propertyRepository;
    imageRepository;
    uploadService;
    constructor(propertyRepository, imageRepository, uploadService) {
        this.propertyRepository = propertyRepository;
        this.imageRepository = imageRepository;
        this.uploadService = uploadService;
    }
    findAll(filters = {}) {
        const where = {};
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
    async findOne(id) {
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: { images: true },
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property ${id} not found`);
        }
        return property;
    }
    create(dto) {
        const property = this.propertyRepository.create(dto);
        return this.propertyRepository.save(property);
    }
    async update(id, dto) {
        const property = await this.findOne(id);
        Object.assign(property, dto);
        return this.propertyRepository.save(property);
    }
    async delete(id) {
        const property = await this.findOne(id);
        await Promise.all(property.images.map((image) => this.uploadService.deleteImage(image.publicId)));
        await this.propertyRepository.remove(property);
    }
    async addImages(propertyId, files) {
        const property = await this.findOne(propertyId);
        const saved = [];
        for (const file of files) {
            const { url, publicId } = await this.uploadService.uploadImage(file);
            const image = this.imageRepository.create({ url, publicId, property });
            saved.push(await this.imageRepository.save(image));
        }
        return saved;
    }
    async deleteImage(imageId) {
        const image = await this.imageRepository.findOne({
            where: { id: imageId },
        });
        if (!image) {
            throw new common_1.NotFoundException(`Image ${imageId} not found`);
        }
        await this.uploadService.deleteImage(image.publicId);
        await this.imageRepository.remove(image);
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(property_image_entity_1.PropertyImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        upload_service_1.UploadService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map