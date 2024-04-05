import {Module} from '@nestjs/common';
import {UserModule} from './modules/entities/User/user.module';
import {TypeOrmModule} from './db/typeorm.module';
import {ConfigModule} from '@nestjs/config';
import {CategoryModule} from './modules/entities/Category/category.module';
import {NewsModule} from './modules/entities/News/news.module';
import {CommentModule} from './modules/entities/Comment/comment.module';
import {AuthModule} from './modules/entities/Auth/auth.module';
import {MessageModule} from "./modules/entities/Message/message.module";
import {CacheModule} from "@nestjs/cache-manager";
import {MailModule} from "./modules/entities/Mailer/mail.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        AuthModule,
        UserModule,
        TypeOrmModule,
        CategoryModule,
        NewsModule,
        CommentModule,
        MessageModule, CacheModule.register([]), MailModule
    ],
})
export class AppModule {
}
