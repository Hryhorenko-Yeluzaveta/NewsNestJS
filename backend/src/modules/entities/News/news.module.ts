import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {News} from "./news.entity";
import {NewsService} from "./news.service";
import {NewsController} from "./news.controller";
import {JwtStrategy} from "../Auth/strategy/jwt.strategy";
import {Category} from "../Category/category.entity";
import {UserModule} from "../User/user.module";
import {MailModule} from "../Mailer/mail.module";
import {MailService} from "../Mailer/mail.service";
import {UserService} from "../User/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([News, Category]), UserModule, MailModule],
    controllers: [NewsController],
    exports: [TypeOrmModule.forFeature([News])],
    providers: [NewsService, JwtStrategy, MailService, UserService]
})

export class NewsModule {}
