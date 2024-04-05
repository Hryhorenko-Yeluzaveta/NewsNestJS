import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseInterceptors,
    Param,
    UseGuards, UploadedFile, Query,
} from '@nestjs/common'
import {FileInterceptor} from "@nestjs/platform-express";
import {Response, Request} from 'express'
import {NewsService} from "./news.service";
import {diskStorage} from "multer";
import {JwtAuthGuard} from "../Auth/guards/jwt-auth.guard";

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}
    @UseGuards(JwtAuthGuard)
    @Post('/:categoryId')
    @UseInterceptors(FileInterceptor('imageSrc', {
        storage: diskStorage({
                destination: './uploads/news',
                filename: (req, file, callback) => {
                    callback(null, file.originalname)
                }
            }
        )
    }))
    async createNews(@UploadedFile() image: Express.Multer.File, @Param('categoryId') categoryId: number , @Req() req: Request, @Res() res: Response)
    {
        try {
            const imagePath = image ? image.path : null;
            const newNews = await this.newsService.createNews(req.body, req.user['id'], imagePath, categoryId)
            return res.status(201).json(newNews);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAllNews(@Res() res: Response) {
        const allNews = await this.newsService.getAllNews()
        return  res.status(200).json(allNews)
    }
    @UseGuards(JwtAuthGuard)
    @Get('/name/:newsName')
    async getNewsByName(@Param('newsName') newsName: string, @Res() res: Response) {
        const foundNews = await this.newsService.getByName(newsName)
        return res.status(200).json(foundNews)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getNewsById(@Param('id') id: number, @Res() res: Response) {
        const foundNews = await this.newsService.getNewsById(id)
        return res.status(200).json(foundNews)
    }
    @UseGuards(JwtAuthGuard)
    @Get('/all/:categoryId')
    async getAllNewsByCategory(@Param('categoryId') categoryId: number, @Res() res: Response ) {
        const newsByCategory = await this.newsService.getAllNewsByCategory(categoryId)
        return res.status(200).json(newsByCategory)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/category/:id')
    async getNewsByCategoryForPag(@Res() res: Response, @Param('id') category: number, @Query('page') page: number, @Query('limit') limit : number) {
        const foundNews = await this.newsService.getNewsByCategoryForPag(category, +page, +limit)
        return res.status(200).json(foundNews)
    }
    @UseGuards(JwtAuthGuard)
    @Get('/author/:id')
    async getAllNewsByAuthor(@Param('id') userId: number, @Res() res: Response) {
        const foundNews = await this.newsService.getNewsByAuthorId(userId)
        return res.status(200).json(foundNews)
    }
    @Get('uploads/news/:filename')
    serveImage(@Param('filename') filename: string, @Res() res: Response) {
        return res.sendFile(filename, {root: './uploads/news'});
    }
}