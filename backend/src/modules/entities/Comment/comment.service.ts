import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Equal, Repository} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../User/user.entity';
import {News} from "../News/news.entity"; // Импорт модели пользователя

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(News) private readonly newsRepository: Repository<News>
    ) {}
    async getCommentsByNewsId(newsId: number) {
        return this.commentRepository.find({where: {news: Equal(newsId)}, relations: {user: true}})
    }
    async createNewComment(commentData: Partial<Comment>, userId: number, newsId : number): Promise<Comment> {
        try {
            const user = await this.userRepository.findOne({where: {id: userId}});
            const news = await this.newsRepository.findOne({where: {id: newsId}})
            if (!user) {
                throw new Error('Користувача на знайдено');
            }
            if (!news) {
                throw new Error('Новина на знайдена');
            }
            commentData.user = user;
            commentData.news = news
            const newComment = this.commentRepository.create(commentData);
            return await this.commentRepository.save(newComment);
        } catch (error) {
            throw new Error(`Failed to create comment: ${error.message}`);
        }
    }
}
