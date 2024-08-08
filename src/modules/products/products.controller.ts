import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put, Query, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "../users/roles.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateProductDto } from "./product.dto";

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor (private  productsService: ProductsService) {}

  @ApiOperation({ summary: 'Obtener todos los productos', description: 'Devuelve una lista paginada de todos los productos disponibles.' })
  @Get()
  getProducts(
    @Query('page') page: string, @Query('limit') limit: string
  ) {
    return this.productsService.getProducts(Number(page), Number(limit));
  }
  
  @ApiOperation({ summary: 'Añadir productos de ejemplo', description: 'Añade productos de ejemplo a la base de datos.' })
  @Get('seeder')
  addProducts() {
    return this.productsService.addProducts()
  }

  @ApiOperation({ summary: 'Obtener producto por ID', description: 'Devuelve el producto correspondiente al ID proporcionado.' })
  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards( AuthGuard, RolesGuard)
  getProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProduct(id);
  }

  @ApiOperation({ summary: 'Actualizar producto por ID', description: 'Actualiza el producto correspondiente al ID proporcionado.' })
  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateProducts(@Param('id', ParseUUIDPipe) id: string, @Body() product: UpdateProductDto) {
    return this.productsService.updateProduct(id, product)
  }

  @ApiOperation({ summary: 'Eliminar producto por ID', description: 'Elimina el producto correspondiente al ID proporcionado.' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }
}
