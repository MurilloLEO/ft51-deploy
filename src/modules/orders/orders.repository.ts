import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Orders } from "./orders.entity";
import { OrderDetails } from "./orderDetails.entity";
import { Users } from "../users/users.entity";
import { Products } from "../products/products.entity";
import { CreateOrderDto } from "./orders.dto";

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectEntityManager()
        private entityManager: EntityManager,
        @InjectRepository(Orders)
        private ordersRepository: Repository<Orders>,
        @InjectRepository(OrderDetails)
        private orderDetailsRepository: Repository<OrderDetails>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
    ) {}

    async addOrder(userId: string, products: CreateOrderDto['products']) {
        let total = 0;
        let order: Orders;
        let productsArray: Products[] = [];
        const productIds = new Set<string>();

        // Verificar si hay productos duplicados en la orden
        const productIdsInOrder = new Set<string>();
        for (const element of products) {
            if (productIdsInOrder.has(element.id)) {
                throw new BadRequestException(`No se pueden comprar dos productos iguales: Producto con id ${element.id} repetido`);
            }
            productIdsInOrder.add(element.id);
        }

        await this.entityManager.transaction(async (transactionalEntityManager) => {
            // Verificar existencia del usuario
            const user = await transactionalEntityManager.getRepository(Users).findOneBy({ id: userId });
            if (!user) {
                throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
            }

            // Crear la orden
            order = new Orders();
            order.date = new Date();
            order.user = user;
            const newOrder = await transactionalEntityManager.getRepository(Orders).save(order);

            try {
                // Asociar productos con la orden
                for (const element of products) {
                    const product = await transactionalEntityManager.getRepository(Products).findOneBy({ id: element.id });
                    if (!product) {
                        throw new BadRequestException(`Producto con id ${element.id} no encontrado`);
                    }
                    if (product.stock <= 0) {
                        throw new BadRequestException(`Producto con id ${element.id} no disponible en stock`);
                    }
                    
                    // Actualizar stock del producto
                    total += Number(product.price);
                    product.stock -= 1;
                    productsArray.push(product);
                    await transactionalEntityManager.getRepository(Products).save(product);
                }

                // Crear y guardar OrderDetails
                const orderDetail = new OrderDetails();
                orderDetail.price = Number(total.toFixed(2));
                orderDetail.products = productsArray;
                orderDetail.order = newOrder;
                await transactionalEntityManager.getRepository(OrderDetails).save(orderDetail);

                // Asociar detalles con la orden
                newOrder.orderDetails = orderDetail;
                await transactionalEntityManager.getRepository(Orders).save(newOrder);

            } catch (error) {
                if (error instanceof BadRequestException) {
                    throw error;  // Propaga el error BadRequestException
                }
                throw new InternalServerErrorException('Error al procesar la orden: ' + error.message);
            }
            
        });

        // Devolver la orden con detalles
        const orderConStock = await this.ordersRepository.findOne({
            where: { id: order.id },
            relations: {
                orderDetails: {
                    products: true,
                },
            },
        });
        
        const sanitizedOrder = {
            ...orderConStock,
            orderDetails: {
                ...orderConStock.orderDetails,
                products: orderConStock.orderDetails.products.map(({ stock, ...productWithoutStock }) => productWithoutStock)
            }
        };
        return sanitizedOrder;
        
        
    }

    async getOrder(id: string) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: {
                orderDetails: {
                    products: true,
                },
            },
        });

        if (!order) {
            throw new NotFoundException(`Orden con id ${id} no encontrada`);
        }

        const sanitizedOrder = {
            ...order,
            orderDetails: {
                ...order.orderDetails,
                products: order.orderDetails.products.map(({ stock, ...productWithoutStock }) => productWithoutStock)
            }
        };
        return sanitizedOrder;
    }

}
