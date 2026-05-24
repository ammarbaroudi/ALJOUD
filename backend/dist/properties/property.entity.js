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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = exports.PropertyStatus = void 0;
const typeorm_1 = require("typeorm");
const property_image_entity_1 = require("./property-image.entity");
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["FOR_SALE"] = "\u0644\u0644\u0628\u064A\u0639";
    PropertyStatus["FOR_RENT"] = "\u0644\u0644\u0625\u064A\u062C\u0627\u0631";
    PropertyStatus["SOLD"] = "\u0645\u0628\u0627\u0639";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
let Property = class Property {
    id;
    title;
    description;
    price;
    location;
    status;
    isFeatured;
    images;
    createdAt;
    updatedAt;
};
exports.Property = Property;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Property.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'الخالدية - حمص' }),
    __metadata("design:type", String)
], Property.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PropertyStatus,
        default: PropertyStatus.FOR_SALE,
    }),
    __metadata("design:type", String)
], Property.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_image_entity_1.PropertyImage, (image) => image.property),
    __metadata("design:type", Array)
], Property.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Property.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Property.prototype, "updatedAt", void 0);
exports.Property = Property = __decorate([
    (0, typeorm_1.Entity)('properties')
], Property);
//# sourceMappingURL=property.entity.js.map