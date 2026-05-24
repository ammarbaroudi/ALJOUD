import { ConfigService } from '@nestjs/config';
export interface UploadResult {
    url: string;
    publicId: string;
}
export declare class UploadService {
    private readonly config;
    constructor(config: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<UploadResult>;
    deleteImage(publicId: string): Promise<void>;
}
