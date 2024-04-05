import {Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import { Request, Response } from 'express';
import {MessageService} from "./message.service";
import {JwtAuthGuard} from "../Auth/guards/jwt-auth.guard";

@Controller('messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) {
    }
    @UseGuards(JwtAuthGuard)
    @Post('')
    async createMessage(@Req() req: Request, @Res() res: Response) {
        const userId = req.user['id']
        const createdMessage = await this.messageService.createMessage(req.body, userId)
        return res.status(201).json(createdMessage)
    }
    @UseGuards(JwtAuthGuard)
    @Get('')
    async getAllMessages(@Res() res: Response) {
        const allMessages =  await this.messageService.getAllMessages()
        return res.status(200).json(allMessages)

    }
}
