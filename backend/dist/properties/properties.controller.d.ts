import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyStatus } from './property.entity';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    findAll(status?: PropertyStatus, featured?: string): Promise<import("./property.entity").Property[]>;
    findOne(id: string): Promise<import("./property.entity").Property>;
    create(dto: CreatePropertyDto): Promise<import("./property.entity").Property>;
    update(id: string, dto: UpdatePropertyDto): Promise<import("./property.entity").Property>;
    deleteImage(imageId: string): Promise<void>;
    delete(id: string): Promise<void>;
    addImages(id: string, files: Express.Multer.File[]): Promise<import("./property-image.entity").PropertyImage[]>;
}
