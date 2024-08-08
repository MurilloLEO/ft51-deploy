import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserDto } from './users.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,

    ) {}

    @ApiOperation({ summary: 'Obtener usuarios paginados', description: 'Obtiene una lista paginada de usuarios.' })
    @ApiBearerAuth()
    @Get()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)    
    getUsers(@Query('page') page: string, @Query('limit') limit: string) {
        !page? (page = "1"): page;
        !limit? (limit = "5"): limit; 
        if(page && limit) return this.usersService.getUsers(Number(page), Number(limit));
    
    }


    @ApiOperation({ summary: 'Obtener usuario por ID', description: 'Obtiene un usuario específico por su ID.' })
    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard)
    getUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.getUser(id);
    }

    @ApiOperation({ summary: 'Actualizar usuario', description: 'Actualiza los datos de un usuario existente.' })
    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(AuthGuard)
    updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() user: UpdateUserDto) {
        return this.usersService.updateUser(id, user);
    }

    
    @ApiOperation({ summary: 'Convierte en administrador a un usuario por ID', description: 'Convertir en administrador a un usuario existente en la BBDD por su ID' })
    @ApiBearerAuth()
    @Put('/admin/:id')
    updateUserAdmin(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.userAdmin(id);
    }
    
    @ApiOperation({ summary: 'Eliminar usuario', description: 'Elimina un usuario existente por su ID.' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard)
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id);
    }
    
}