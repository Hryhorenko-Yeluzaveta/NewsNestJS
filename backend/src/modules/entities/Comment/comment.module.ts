import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Comment} from "./comment.entity";
import {CommentService} from "./comment.service";
import {CommentController} from "./comment.controller";
import {UserModule} from "../User/user.module";
import {NewsModule} from "../News/news.module";
import {JwtStrategy} from "../Auth/strategy/jwt.strategy";

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), UserModule, NewsModule],
    controllers: [CommentController],
    providers: [CommentService, JwtStrategy]
})

export class CommentModule {}
