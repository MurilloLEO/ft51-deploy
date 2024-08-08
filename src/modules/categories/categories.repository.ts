import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as data from '../../utils/data.json';
import { Categories } from "./categories.entity";



@Injectable()
export class CategoriesRepository {
    constructor (
        @InjectRepository(Categories)
        private readonly categoriesRepository: Repository<Categories>,
    ) {}

    
    async getCategories() {
        return await this.categoriesRepository.find();
    }

    
    async addCategories(): Promise<string>{
        data?.map(async (element) => {
            await this.categoriesRepository
            .createQueryBuilder()
            .insert()
            .into(Categories)
            .values({name: element.category})
            .orIgnore()
            .execute();
        });
        return 'Categorías Agregadas'
    }

}