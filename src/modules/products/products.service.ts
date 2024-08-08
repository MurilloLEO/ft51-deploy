import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from './products.entity';
import { UpdateProductDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(private  productsRepository: ProductsRepository) {}
  
  getProducts(page: number, limit: number){
    return this.productsRepository.getProducts(page, limit);
  }

  getProduct(id: string) {
    return this.productsRepository.getProduct(id);
  }

  addProducts() {
    return this.productsRepository.addProducts();
  }

  updateProduct(id:string, product: UpdateProductDto) {
    return this.productsRepository.updateProduct(id, product);
  }

  deleteProduct(id: string) {
    return this.productsRepository.deleteProduct(id);
  }
}
