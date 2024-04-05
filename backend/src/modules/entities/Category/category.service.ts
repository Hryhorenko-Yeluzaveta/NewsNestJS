import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {Category} from "./category.entity";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
                @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    async createCategory(categoryData: Category[]): Promise<Category[]> {
        try {
            const newCategory = this.categoryRepository.create(categoryData);
            return await this.categoryRepository.save(newCategory);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getCategoryById(categoryId: number): Promise<Category> {
        try {
            return await this.categoryRepository.findOne({where: {id: categoryId}})
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAllCategoriesWithPag(page: number, limit: number): Promise<Category[]> {
        try {
            const categories = await this.categoryRepository.find({
                select: ['id', 'name'],
                relations: {news: true},
                take: limit,
                skip: (page-1) * limit
            });
            categories.forEach(category => {
                category.news = category.news.sort((freshNews, oldNews) => oldNews.date.getTime() - freshNews.date.getTime());
                category.news = category.news.slice(0, 5);
                category.news.forEach(news => {
                    const cacheKey = `News: ${news.id}`;
                    const existingNewsInCache = this.cacheManager.get(cacheKey);
                    if (existingNewsInCache === null) {
                        this.cacheManager.set(cacheKey, news, 300000);
                    }
                });
            })
            return categories;

        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAllCategories() {
        try {
            return await this.categoryRepository.find({
                relations: {news: true},
            })
        }
        catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}