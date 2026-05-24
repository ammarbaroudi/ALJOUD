import { PropertyImage } from './property-image.entity';
export declare enum PropertyStatus {
    FOR_SALE = "\u0644\u0644\u0628\u064A\u0639",
    FOR_RENT = "\u0644\u0644\u0625\u064A\u062C\u0627\u0631",
    SOLD = "\u0645\u0628\u0627\u0639"
}
export declare class Property {
    id: string;
    title: string;
    description: string | null;
    price: number | null;
    location: string;
    status: PropertyStatus;
    isFeatured: boolean;
    images: PropertyImage[];
    createdAt: Date;
    updatedAt: Date;
}
