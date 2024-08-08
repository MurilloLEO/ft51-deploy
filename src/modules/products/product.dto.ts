import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateProductDto {

    @ApiProperty({
        description: 'Nombre del producto (máximo 50 caracteres)',
        example: 'Televisor LED 4K'
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({
        description: 'Descripción detallada del producto',
        example: 'Televisor de 55 pulgadas con resolución Ultra HD 4K'
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Precio del producto con hasta 2 decimales',
        example: '1299.99'
    })
    @IsOptional()
    @IsNumber()
    price: number;

}