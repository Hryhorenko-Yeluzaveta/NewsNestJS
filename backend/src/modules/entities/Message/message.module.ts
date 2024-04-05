import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "./message.entity";
import {JwtService} from "@nestjs/jwt";
import {UserModule} from "../User/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule],
  providers: [MessageService, JwtService],
  controllers: [MessageController]
})
export class MessageModule {}
