import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { Categories } from '../categories/categories.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Products, Categories])
    ],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsRepository],
})

export class ProductsModule {}