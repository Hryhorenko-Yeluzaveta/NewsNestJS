import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {UserService} from "../User/user.service";
import * as bcrypt from "bcrypt"
import {JwtService} from "@nestjs/jwt";
import {User} from "../User/user.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findOne(email);
        if (!user) throw new ConflictException('Користувача з таким email не існує.')
        else {
            const passwordResult = await bcrypt.compare(password, user.password);
            if (!passwordResult) throw new ConflictException('Паролі не співпадають.')
            else {
                return user
            }
        }
    }
    async login(user: User) {
        const token = this.jwtService.sign(
            { id: user.id, email: user.email },
            {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1h',
            },
        );
        return {...user, token};
    }
}
