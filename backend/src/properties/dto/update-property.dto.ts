import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PropertyStatus } from '../property.entity';

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
