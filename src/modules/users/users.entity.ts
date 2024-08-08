import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "../orders/orders.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "./roles.enum";


@Entity({name: 'USERS'})
export class Users {

    @ApiProperty({
        description: 'Identificador único generado por la base de datos (UUID v4)',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ApiProperty({
        description: 'Nombre del usuario (minimo 3 y máximo 80 caracteres)',
        example: 'John Doe'
    })
    @Column({type: 'varchar', length: 80, nullable: false})
    name: string;

    @ApiProperty({
        description: 'Correo electrónico único del usuario (formato email)',
        example: 'john.doe@example.com'
    })
    @Column({unique: true, type: 'varchar', length: 50, nullable: false})
    email: string;
    
    @ApiProperty({
        description: 'Contraseña encriptada del usuario debe contener entre 8 y 15 caracteres, e incluir una minuscula, una mayuscula, un numero y un caracter especial',
        example: 'aaBB33##'
    })
    @Column({type: 'varchar', length: 128, nullable: false})
    password: string;

    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: 123456789
    })
    @Column({type: 'int', nullable: true})
    phone: number;

    @ApiProperty({
        description: 'País de residencia del usuario',
        example: 'United States'
    })
    @Column({type: 'varchar', length: 50})
    country: string;

    @ApiProperty({
        description: 'Dirección física del usuario (debe ser de entre 3 y 80 caracteres)',
        example: '123 Main St, Anytown'
    })
    @Column({type: 'text'})
    address: string;

    @ApiProperty({
        description: 'Ciudad de residencia del usuario',
        example: 'Anytown'
    })
    @Column({type: 'varchar', length: 40})
    city: string;

    @ApiProperty({
        description: 'Indicador si el usuario tiene permisos de administrador',
        example: false
    })
    @Column({default: false})
    isAdmin: boolean;

    
    @OneToMany(() => Orders, (order) => order.user)
    @JoinColumn({name: 'order_id'})
    orders: Orders[];
}