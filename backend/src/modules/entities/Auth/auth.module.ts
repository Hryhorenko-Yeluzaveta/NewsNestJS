import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserModule} from "../User/user.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategy/local.strategy";
import { AuthController } from './auth.controller';
import {JwtService} from "@nestjs/jwt";
import {JwtStrategy} from "./strategy/jwt.strategy";

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtService],
  imports: [UserModule, PassportModule],
  controllers: [AuthController]
})
export class AuthModule {}
