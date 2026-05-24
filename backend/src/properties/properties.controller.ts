import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertiesService, PropertyFilters } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyStatus } from './property.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  findAll(
    @Query('status') status?: PropertyStatus,
    @Query('featured') featured?: string,
  ) {
    const filters: PropertyFilters = {};
    if (status !== undefined) {
      filters.status = status;
    }
    if (featured !== undefined) {
      filters.isFeatured = featured === 'true';
    }
    return this.propertiesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('images/:imageId')
  deleteImage(@Param('imageId', ParseUUIDPipe) imageId: string) {
    return this.propertiesService.deleteImage(imageId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  addImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.propertiesService.addImages(id, files);
  }
}
