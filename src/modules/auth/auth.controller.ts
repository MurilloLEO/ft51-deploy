import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/users.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Users } from '../users/users.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Obtener información de autenticación', description: 'Obtiene información general sobre la autenticación.' })    
    @Get()
    getAuth() {
        return this.authService.getAuth();
    }

    @ApiOperation({ summary: 'Registrar usuario', description: 'Registra un nuevo usuario en el sistema.' })
    @Post('signup')
    signUp(@Body() user: CreateUserDto) {
        return this.authService.signUp(user);
    }

    @ApiOperation({ summary: 'Iniciar sesión', description: 'Permite a un usuario iniciar sesión en el sistema.' })
    @Post('signin')
    signIn(@Body() credential: LoginUserDto) {
        const { email, password } = credential;
        return this.authService.signIn(email, password);
    }

}