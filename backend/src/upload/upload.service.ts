import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export interface UploadResult {
  url: string;
  publicId: string;
}

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  uploadImage(file: Express.Multer.File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'aljoud-properties' },
        (error, result) => {
          if (error || !result) {
            return reject(
              new InternalServerErrorException('Image upload failed'),
            );
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      Readable.from(file.buffer).pipe(stream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
