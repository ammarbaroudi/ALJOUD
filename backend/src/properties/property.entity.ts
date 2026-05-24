import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyImage } from './property-image.entity';

export enum PropertyStatus {
  FOR_SALE = 'للبيع',
  FOR_RENT = 'للإيجار',
  SOLD = 'مباع',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', nullable: true })
  price: number | null;

  @Column({ default: 'الخالدية - حمص' })
  location: string;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.FOR_SALE,
  })
  status: PropertyStatus;

  @Column({ default: false })
  isFeatured: boolean;

  @OneToMany(() => PropertyImage, (image) => image.property)
  images: PropertyImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
