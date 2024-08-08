import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Products } from "../products/products.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({
    name: 'ORDERDETAILS'
})
export class OrderDetails {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    price: number;

    @OneToOne(() => Orders, (order) => order.orderDetails)
    @JoinColumn({ name: 'order_id'})
    order: Orders;

    @ManyToMany(() => Products)
    @JoinTable({
        name: 'ORDERDETAILS_PRODUCTS',
        joinColumn: { 
            name: 'product_id', 
            referencedColumnName: 'id' 
        },
        inverseJoinColumn: { 
            name: 'orderdetail_id', 
            referencedColumnName: 'id' 
        }
    })
    products: Products[];
}