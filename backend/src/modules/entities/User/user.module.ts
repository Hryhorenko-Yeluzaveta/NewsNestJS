import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {JwtStrategy} from "../Auth/strategy/jwt.strategy";
import {Category} from "../Category/category.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Category])],
    exports: [TypeOrmModule.forFeature([User]), UserService],
    controllers: [UserController],
    providers: [UserService, JwtStrategy]
})

export class UserModule {}
