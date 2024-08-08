import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetails } from "../orders/orderDetails.entity";
import { Categories } from "src/modules/categories/categories.entity";
import { ApiProperty } from "@nestjs/swagger";



@Entity({
    name: 'PRODUCTS'
})
export class Products {

    @ApiProperty({
        description: 'uuid v4 generado por la BBDD',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Nombre del producto (máximo 50 caracteres)',
        example: 'Televisor LED 4K'
    })
    @Column({type: 'varchar', length: 50, nullable: false, unique: true})
    name: string;

    @ApiProperty({
        description: 'Descripción detallada del producto',
        example: 'Televisor de 55 pulgadas con resolución Ultra HD 4K'
    })
    @Column({type: 'text', nullable: false})
    description: string;

    @ApiProperty({
        description: 'Precio del producto con hasta 2 decimales',
        example: '1299.99'
    })
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @ApiProperty({
        description: 'Cantidad disponible en stock (número entero)',
        example: 50
    })
    @Column({type: 'int', nullable: false})
    stock: number;

    @ApiProperty({
        description: 'URL de la imagen del producto',
        nullable: true
    })
    @Column({ type: 'text', nullable: true })
    imgUrl: string;

    
    @ManyToOne(() => Categories, (category) => category.products)
    @JoinColumn({ name: 'category_id'})
    category: Categories;

    
    @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
    orderDetails: OrderDetails[];
}

