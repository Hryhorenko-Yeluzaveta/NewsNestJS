import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "./category.entity";
import {CategoryController} from "./category.controller";
import {CategoryService} from "./category.service";
import {JwtStrategy} from "../Auth/strategy/jwt.strategy";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
    imports: [TypeOrmModule.forFeature([Category]), CacheModule.register({
        ttl: 300,
    }),],
    controllers: [CategoryController],
    providers: [CategoryService, JwtStrategy]
})

export class CategoryModule {}
