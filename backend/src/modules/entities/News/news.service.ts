import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Equal, Repository} from 'typeorm'
import {News} from "./news.entity";
import {User} from "../User/user.entity";
import {Category} from "../Category/category.entity";
import {UserService} from "../User/user.service";
import {MailService} from "../Mailer/mail.service";

@Injectable()
export class NewsService {
    constructor(@InjectRepository(News) private readonly newsRepository: Repository<News>,
                @InjectRepository(User) private readonly userRepository: Repository<User>,
                @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
                private readonly userService: UserService,
                private readonly mailService: MailService) {
    }

    public async createNews(newsData: News, userId: number, imageSrc: string, categoryId: number) {
        try {
            const user = await this.userRepository.findOne({where: {id: userId}})
            const category = await this.categoryRepository.findOne({where: {id: categoryId}})
            const news = this.newsRepository.create({...newsData, author: user, imageSrc, category});
            const subscribers = await this.userService.getUsersByCategory(categoryId);
            console.log(subscribers)
            if(subscribers) {
                const promises = subscribers.map(async (subscriber) => {
                    await this.mailService.sendEmail(subscriber.email, `Свіжа новина вже в категорії ${category.name}`, `Привіт, ${subscriber.username}!\n\nВ категорії ${category.name} з'явилася свіжа новина:\n${newsData.name}: ${newsData.text}`);
                });
                await Promise.all(promises);
            }
            return await this.newsRepository.save(news)
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async getAllNews() {
        try {
            return await this.newsRepository.find()
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async getByName(newsName: string) {
        try {
            const foundNews = await this.newsRepository.findOne({where: {name:newsName}, order: {date: 'DESC'}})
            if(foundNews) {
                return foundNews
            }else {
                throw new Error('Новину не знайдено')
            }
        } catch (e){
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async getNewsById(id: number) {
        try {
            return await this.newsRepository.findOne({where: {id}, relations: {comment: true, author: true}})
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAllNewsByCategory(categoryId: number) {
        try {
            return await this.newsRepository.find({where: {category: Equal(categoryId)}, order: {date: 'DESC'}})
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async getNewsByCategoryForPag(categoryId: number, page: number, limit: number) {
        try {
            return this.newsRepository.find({
                where: {category: Equal(categoryId)},
                select: ['id', 'name', 'imageSrc', 'author', 'text', 'date'],
                order: {date: 'DESC'},
                take: limit,
                skip: (page-1) * limit
            })
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getNewsByAuthorId(userId: number) {
        try {
            return this.newsRepository.find({
                where: {author: Equal(userId)},
                relations: {author: true},
                order: {date: 'DESC'}
            })
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}