import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor (private readonly categoriesService: CategoriesService) {}

    @ApiOperation({ summary: 'Agregar categorías', description: 'Agrega nuevas categorías a la base de datos.' })
    @Get('seeder')
    addCategories() {
        return this.categoriesService.addCategories();
    }

    @ApiOperation({ summary: 'Obtener categorías', description: 'Obtiene todas las categorías disponibles.' })
    @Get()
    getCategories() {
        return this.categoriesService.getCategories();
    }
}
