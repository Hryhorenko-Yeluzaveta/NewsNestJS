import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post, Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import {query, Request, Response} from 'express'
import {CategoryService} from "./category.service";
import {JwtAuthGuard} from "../Auth/guards/jwt-auth.guard";

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {
    }
    @UseGuards(JwtAuthGuard)
    @Post('/')
    async createCategory(@Req() req: Request, @Res() res: Response) {
        const category = await this.categoryService.createCategory(req.body)
        return res.status(201).json(category)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    async getAllCategories(@Res() res: Response) {
        const categories = await this.categoryService.getAllCategories()
        return res.status(200).json(categories)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAllCategoriesWithPag(@Res() res: Response, @Query('page') page: number, @Query('limit') limit : number) {
        const categories = await this.categoryService.getAllCategoriesWithPag(+page, +limit)
        return res.status(200).json(categories)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getCategoryById(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
        const findedCategory = await this.categoryService.getCategoryById(id)
        return res.status(200).json(findedCategory)
    }



}