import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Property } from './property.entity';

@Entity('property_images')
export class PropertyImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @ManyToOne(() => Property, (property) => property.images, {
    onDelete: 'CASCADE',
  })
  property: Property;
}
