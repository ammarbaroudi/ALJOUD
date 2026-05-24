import { PropertyStatus } from '../property.entity';
export declare class UpdatePropertyDto {
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    status?: PropertyStatus;
    isFeatured?: boolean;
}
