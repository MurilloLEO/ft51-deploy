import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository, } from '../users/users.repository';
import { Users } from '../users/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/users.dto';

@Injectable()
export class AuthService {
    constructor (
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService

    ) {}

    getAuth(): string {
        return "Autenticación...";
    }

    async signIn(email: string, password: string) {
        
        //* verificamos si el usuario existe
        const user = await this.usersRepository.getUserByEmail(email);
        if(!user) throw new BadRequestException('Credenciales incorrectas');

        //* Validar Password:
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) throw new BadRequestException('Credenciales Invalidas');
        
        //*Firmar Token:
        const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
        const token = this.jwtService.sign(payload);
        
        
        return {
            message: ' Usuario Logueado...',
            token,
        };

    }

    async signUp(user: CreateUserDto) {
        const { email, password } = user;
        
        //* Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        //* Crear usuario en BBDD:
        const newUser = await this.usersRepository.addUser({
            ...user,
            password: hashedPassword
        })

        return {
            message: 'Usuario registrado exitosamente',
            user: newUser,
        };
    

    }

}