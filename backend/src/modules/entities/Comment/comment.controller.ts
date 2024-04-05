import {Controller, Post, Param, Req, Res, Get, UseGuards, Body} from '@nestjs/common';
import { Request, Response } from 'express';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import {JwtAuthGuard} from "../Auth/guards/jwt-auth.guard";
@Controller('comment')
export class CommentController {
    constructor(private readonly commentsService: CommentService) {}
    @UseGuards(JwtAuthGuard)
    @Get('/:newsId')
    async getCommentsByNewsId(@Param('newsId') newsId: number, @Res() res : Response) {
        try {
            const foundComments = await this.commentsService.getCommentsByNewsId(newsId)
            return res.status(200).json(foundComments)
        } catch (e) {
            return res.status(500).json({ message: 'Failed to get comments', error: e.message })
        }
    }
    @UseGuards(JwtAuthGuard)
    @Post('/:newsId')
    async createNewComment(@Param('newsId') id: number, @Body() body: any, @Req() req: Request, @Res() res: Response) {
        try {
            const { text } = body;
            const userId = req.user['id'];
            const newComment: Partial<Comment> = { text };
            const createdComment = await this.commentsService.createNewComment(newComment, userId, id);
            return res.status(201).json(createdComment);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to create comment', error: error.message });
        }
    }
}