import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository} from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, AuthService],
})
export class UsersModule {}