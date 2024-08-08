import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from '../products/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
    constructor(
        private readonly fileUploadRepository: FileUploadRepository,
        @InjectRepository(Products) 
            private readonly productsRepository: Repository<Products>, 
    ) {}

    async uploadImage(file: Express.Multer.File, productId: string) {

        const product = await this.productsRepository.findOneBy({id: productId});
        if(!product) {
            throw new NotFoundException('Producto no encontrado');
        } 

        
        const response = await this.fileUploadRepository.uploadImage(file);
        if(!response.secure_url) {
            throw new NotFoundException('Error al cargar imagen en Cloudinary');
        }
        
        await this.productsRepository.update(productId, {
            imgUrl: response.secure_url,
        });
        
        const updatedProduct = await this.productsRepository.findOneBy({id: productId});

        return updatedProduct;

    }

}
