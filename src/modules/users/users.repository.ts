import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ){}

    async getUsers(page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;
            const users = await this.usersRepository.find({
                take: limit,
                skip: skip,
            });

            return users.map(({ password, ...userNoPassword }) => userNoPassword);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener usuarios: ' + error.message);
        }
    }

    async getById(id: string): Promise<Partial<Users>> {
        try {
            const user = await this.usersRepository.findOne({
                where: { id },
                relations: {
                    orders: true,
                },
            });
            if (!user) throw new NotFoundException(`No se encontró el usuario con id ${id}`);
            
            const { password, ...userNoPassword } = user;
            return userNoPassword;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; // Propaga el error NotFoundException
            }
            throw new InternalServerErrorException('Error al obtener el usuario: ' + error.message);
        }
    }

    async addUser(user: CreateUserDto): Promise<Partial<Users>> {
        try {

            const existingUser = await this.usersRepository.findOneBy({ email: user.email });
            if (existingUser) {
                throw new BadRequestException('El usuario con este email ya existe');
            }
            
            const newUser = await this.usersRepository.save(user);

            const dbUser = await this.usersRepository.findOneBy({ id: newUser.id });
            if (!dbUser) throw new InternalServerErrorException(`Error al recuperar el usuario recién creado con id ${newUser.id}`);

            const { password, isAdmin, ...userNoPassword } = dbUser;
            return userNoPassword;
            
        } catch (error) {
            throw new BadRequestException('Error al agregar el usuario: ' + error.message);
        }
    }

    async updateUser(id: string, user: UpdateUserDto): Promise<Partial<Users>> {
        try {
            const result = await this.usersRepository.update(id, user);
            if (result.affected === 0) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
            
            const updatedUser = await this.usersRepository.findOneBy({ id });
            if (!updatedUser) throw new InternalServerErrorException(`Error al recuperar el usuario actualizado con id ${id}`);

            const { password, isAdmin, ...userNoPassword } = updatedUser;
            return userNoPassword;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; // Propaga el error NotFoundException
            }
            throw new InternalServerErrorException('Error al actualizar el usuario: ' + error.message);
        }
    }

    async deleteUser(id: string) {
        try {
            const user = await this.usersRepository.findOne({
                where: { id },
                relations: ['orders'], 
            });

            if (!user) throw new NotFoundException('Usuario no encontrado');

            if (user.orders && user.orders.length > 0) {
                throw new BadRequestException('No se puede eliminar el usuario ya que posee una orden de compra en curso');
            }

            await this.usersRepository.remove(user);
            
            return { 
                message: `Usuario con id: ${id} eliminado`,
                statusCode: 200,  
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error; // Propaga el error NotFoundException
            }
            throw new InternalServerErrorException('Error al eliminar el usuario: ' + error.message);
        }
    }

    async getUserByEmail(email: string): Promise<Users> {
        try {
            const userByEmail = await this.usersRepository.findOneBy({ email });
            if (!userByEmail) throw new NotFoundException('Usuario no encontrado');
            return userByEmail;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; // Propaga el error NotFoundException
            }
            throw new InternalServerErrorException('Error al obtener el usuario por email: ' + error.message);
        }
    }

    async userAdmin (id: string): Promise<Partial<Users>> {
        
        const userDb = await this.usersRepository.findOneBy({id});
        if(!userDb) throw new NotFoundException('usuario no encontrado');

        userDb.isAdmin = true;

        await this.usersRepository.save(userDb);

        const { password, ...userNoPassword} = userDb;

        return userNoPassword;
    }
}
