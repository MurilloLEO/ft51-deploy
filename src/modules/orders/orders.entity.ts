import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users/users.entity";
import { OrderDetails } from "./orderDetails.entity";



@Entity({
    name: 'ORDERS'
})
export class Orders {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text'})
    date: Date;

    @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
    orderDetails: OrderDetails;
    
    @ManyToOne(() => Users, (user) => user.orders)
    @JoinColumn({name:'user_id'}) 
    user: Users;
    
}