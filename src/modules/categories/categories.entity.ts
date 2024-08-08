import { ApiProperty } from "@nestjs/swagger";
import { Products } from "src/modules/products/products.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name: 'CATEGORIES'
})
export class Categories {

    @ApiProperty({
        description: 'Identificador único generado por la base de datos (UUID v4)',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Nombre de la categoría (máximo 50 caracteres)',
        example: 'Electrónicos'
    })
    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        unique: true,
    })
    name: string;

    @ApiProperty({
        description: 'Lista de productos pertenecientes a esta categoría',
    })
    @OneToMany(() => Products, (product) => product.category)
    @JoinColumn()
    products: Products[];

}