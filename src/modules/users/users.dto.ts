import { ApiHideProperty, PickType } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, matches, Matches, MaxLength, MinLength, Validate } from "class-validator";
import { MatchPasssword } from "src/decorators/matchPasssword.decorators";

export class CreateUserDto {

    /**
     * Debe ser un string de entre 3 y 80 caracteres
     * @example 'test User'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, {message: 'El nombre no puede contener numeros ni caracteres especiales, solo se aceptan letras'})
    name: string;

    /**
     * Debe ser un string con formato email valido
     * @example 'user01@example.com'
     */
    @IsNotEmpty()
    @IsEmail()
    email: string;

    /**
     * Debe contener entre 8 y 15 caracteres, e incluir al menos una minuscula, una mayuscula, un  numero y un caracter especial
     * @example 'aaBB33##'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, { message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial: !@#$%^&*' })
    password: string;

    /**
     * Debe ser igual al password
     * @example 'aaBB33##'
     */
    @IsNotEmpty()
    @Validate(MatchPasssword, ['password'])
    confirmPassword: string

    /**
     * Debe ser un string de entre 3 y 80 caracteres
     * @example 'test address'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    address: string;

    /**
     * Debe ser un numero
     * @example '12345678'
     */
    @IsNotEmpty()
    @IsNumber()
    phone: number;


    /**
     * Debe ser un string de entre 4 y 50 caracteres
     * @example 'test country' 
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(4) 
    @MaxLength(50)
    country: string;

    /**
     * Debe ser un string de entre 5 y 80 caracteres
     * @example 'test city'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(40)
    city: string;

    @ApiHideProperty()
    @IsEmpty()
    isAdmin: boolean;
}

export class UpdateUserDto {
    /**
    * Debe ser un string de entre 3 y 80 caracteres
    * @example 'test User'
    */
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
    name: string;
 
    /**
      * Debe ser un string con formato email valido
      * @example 'user01@example.com'
      */
    @IsOptional()
    @IsEmail()
    email: string;
 
    /**
      * Debe contener entre 8 y 15 caracteres, e incluir al menos una minuscula, una mayuscula, un  numero y un caracter especial
      * @example 'aaBB33##'
      */
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, { message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial: !@#$%^&*' })
    password: string;


    /**
      * Debe ser un string de entre 3 y 80 caracteres
      * @example 'test addres'
      */
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    address: string;

    /**
      * Debe ser un numero
      * @example '12345678'
      */
    @IsOptional()
    @IsNumber()
    phone: number;


    /**
      * Debe ser un string de entre 4 y 50 caracteres
      * @example 'test country' 
      */
    @IsOptional()
    @IsString()
    @MinLength(4) 
    @MaxLength(50)
    country: string;

    /**
      * Debe ser un string de entre 5 y 80 caracteres
      * @example 'test city'
      */
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(40)
    city: string;

  
}



export class LoginUserDto extends PickType(CreateUserDto, [
    'email',
    'password'
]) {}
    
