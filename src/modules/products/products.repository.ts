import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Products } from "./products.entity";
import { Categories } from "../categories/categories.entity";
import { Repository } from "typeorm";
import * as data from '../../utils/data.json';
import { UpdateProductDto } from "./product.dto";

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Products)
        private  productsRepository: Repository<Products>,
        @InjectRepository(Categories)
        private  categoriesRepository: Repository<Categories>,
    ) {}

    async getProducts(page: number, limit: number): Promise<Products[]> {
        let products = await this.productsRepository.find({
            relations: {
                category: true,
            },
        });

        const start = (page-1) * limit;
        const end = start + limit;
        products = products.slice(start, end);

        return products;
    }

    async getProduct(id: string) {
        const product = await this.productsRepository.findOneBy({id});
        if(!product) {
            throw new NotFoundException(`Producto con id ${id} no encontrado`);
        }

        return product;
    }

    async addProducts() {
        
        const categories = await this.categoriesRepository.find();
        data?.map(async (element) => {
            const category = categories.find(
                (category) => category.name === element.category,
            );

            if (!category) {
                throw new BadRequestException(`La categoría '${element.category}' no existe.`);
            }

            
            const product = new Products();
            product.name = element.name;
            product.description = element.description;
            product.price = element.price;
            product.stock = element.stock;
            product.imgUrl = element.imgUrl;
            product.category = category;

            
            await this.productsRepository.save(product);
        });

        return 'Producto Agregado';
    }


    async updateProduct(id: string, product: UpdateProductDto) {

        const validProduct = await this.productsRepository.findOneBy({id});

        if(!validProduct) return new BadRequestException('Producto inexistente');

        await this.productsRepository.update(id, product);
        
        const updatedProduct = await this.productsRepository.findOneBy({id});

        return {
            message: `Producto con id: ${id} actualizado`,
            statusCode: 200,
            updatedProduct
        };
    }

    async deleteProduct(id: string) {
        const product = await this.productsRepository.findOneBy({id});
        if(!product) return new NotFoundException('Producto no encontrado')

        this.productsRepository.remove(product);
        return {
            message: `Producto con id: ${id} eliminado`,
            statusCode: 200,
        };
    }
}