import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { Products } from "../products/products.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    
    @ApiProperty({
        description: 'Identificador único del usuario generado por la base de datos (UUID v4)',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'Lista de productos a incluir en la orden',
        example: [{ "id": "uuid"},{"id": "uuid"}]
    })
    @IsArray()
    @ArrayMinSize(1)
    products: Partial<Products[]>
}