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
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const properties_service_1 = require("./properties.service");
const create_property_dto_1 = require("./dto/create-property.dto");
const update_property_dto_1 = require("./dto/update-property.dto");
const property_entity_1 = require("./property.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PropertiesController = class PropertiesController {
    propertiesService;
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    findAll(status, featured) {
        const filters = {};
        if (status !== undefined) {
            filters.status = status;
        }
        if (featured !== undefined) {
            filters.isFeatured = featured === 'true';
        }
        return this.propertiesService.findAll(filters);
    }
    findOne(id) {
        return this.propertiesService.findOne(id);
    }
    create(dto) {
        return this.propertiesService.create(dto);
    }
    update(id, dto) {
        return this.propertiesService.update(id, dto);
    }
    deleteImage(imageId) {
        return this.propertiesService.deleteImage(imageId);
    }
    delete(id) {
        return this.propertiesService.delete(id);
    }
    addImages(id, files) {
        return this.propertiesService.addImages(id, files);
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('images/:imageId'),
    __param(0, (0, common_1.Param)('imageId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10)),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "addImages", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map