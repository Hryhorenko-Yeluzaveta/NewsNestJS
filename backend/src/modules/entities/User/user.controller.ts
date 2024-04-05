import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseInterceptors,
    ConflictException, HttpStatus, UseGuards, Patch, Param
} from '@nestjs/common'
import {FileInterceptor} from "@nestjs/platform-express";
import { Response, Request } from 'express'
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../Auth/guards/jwt-auth.guard";
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('/register')
    @UseInterceptors(FileInterceptor(''))
    async register(@Req() req: Request, @Res() res: Response): Promise<Response>{
        try {
            const user = await this.userService.register(req.body)
            return res.status(201).json(user)
        } catch (e){
                if (e instanceof ConflictException) {
                    return res.status(HttpStatus.CONFLICT).json({ message: e.message });
                }
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getUserById(@Req() req: Request, @Res() res: Response){
        const foundUser = await this.userService.getUserById(req.body.id)
        return res.status(200).json(foundUser)
    }

    @UseGuards(JwtAuthGuard)
    @Post('/subscribe/:categoryId')
    async subscribeCategory(@Param('categoryId') categoryId : number, @Req() req : Request, @Res() res: Response) {
        const userId = req.user['id']
        const subscribedUser = await this.userService.userSubscribeCategory(categoryId, userId)
        res.status(200).json(subscribedUser)
    }
}