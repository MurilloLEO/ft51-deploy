import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {}

    @ApiOperation({ summary: 'Subir imagen para un producto', description: 'Sube una imagen para un producto específico identificado por su ID.' })
    @Post('uploadImage/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File to be uploaded'
                }
            }
        }
    })
    //* Extraer imagen dede el Formulario del Body del Request:
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(
        @Param('id') productId: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 200000,
                        message: 'Supera el maximo permitido: 200kb'
                    }),
                    new FileTypeValidator({
                        fileType: /(.jpg|.jpeg|.png|.webp)/,
                    })
                ]
            })
        ) file: Express.Multer.File,
    ){
        return this.fileUploadService.uploadImage(file, productId);
    }
}
