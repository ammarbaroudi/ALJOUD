import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../properties/property.entity';
import { PropertyImage } from '../properties/property-image.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Property, PropertyImage, User],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
