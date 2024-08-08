import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
    constructor (private readonly usersRepository: UsersRepository) {}
    
    getUsers(page: number, limit: number) {
        return this.usersRepository.getUsers(page, limit);
    }

    getUser(id: string) {
        return this.usersRepository.getById(id);
    }

    addUser(user: CreateUserDto) {
        return this.usersRepository.addUser(user);
    }

    updateUser(id: string, user: UpdateUserDto) {
        return this.usersRepository.updateUser(id, user);
    }

    deleteUser(id: string) {
        return this.usersRepository.deleteUser(id);
    }

    userAdmin(id: string) {
        return this.usersRepository.userAdmin(id);
    }
}