import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './orders.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { request } from 'http';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../users/roles.enum';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor (private readonly orderService: OrdersService) {}

    @ApiOperation({ summary: 'Agregar una nueva orden', description: 'Crea una nueva orden para el usuario actual.' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard)
    addOrder(@Body() order: CreateOrderDto) {
        const { userId, products} = order;
        return this.orderService.addOrder(userId, products);
    }

    @ApiOperation({ summary: 'Obtener una orden por ID', description: 'Obtiene los detalles de una orden específica por su ID.' })
    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard)
    getOrder(@Param('id', ParseUUIDPipe) id: string) {
        return this.orderService.getOrder(id);
    }

}
