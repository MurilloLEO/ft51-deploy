import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Orders } from './orders.entity';

@Injectable()
export class OrdersService {
    constructor(private  ordersRepository: OrdersRepository){}
    
    addOrder(userId: string, product: any) {
        return this.ordersRepository.addOrder(userId, product);
    }

    getOrder(id: string) {
        return this.ordersRepository.getOrder(id);
    }

}
