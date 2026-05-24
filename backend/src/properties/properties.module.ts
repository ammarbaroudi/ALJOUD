import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './property.entity';
import { PropertyImage } from './property-image.entity';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { UploadModule } from '../upload/upload.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, PropertyImage]),
    UploadModule,
    AuthModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
