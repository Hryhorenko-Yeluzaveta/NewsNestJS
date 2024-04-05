import {ConflictException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Equal, Repository} from 'typeorm'
import {User} from "./user.entity"
import * as bcrypt from "bcrypt"
import {CreateUserDto} from "./dto/createUser.dto";
import {Category} from "../Category/category.entity";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
                @InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {
    }

    public async register(userData: CreateUserDto): Promise<CreateUserDto> {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(userData.password.toString(), salt)
            const candidateName = await this.userRepository.findOne({where: {username: userData.username}})
            const candidateEmail = await this.userRepository.findOne({where: {email: userData.email}})
            if (candidateName) {
                throw new ConflictException('Користувач з таким іменем вже існує')
            } else if (candidateEmail) {
                throw new ConflictException('Користувач з таким email вже існує')
            } else {
                const newUser = this.userRepository.create({
                    ...userData,
                    password: hashedPassword

                })
                return await this.userRepository.save(newUser)
            }
        } catch (e) {
            throw new ConflictException(e.message);
        }
    }


    async findOne(email: string) {
        return await this.userRepository.findOne({where: {email}});
    }

    async getUserById(id: number) {
        try {
            return await this.userRepository.findOne({where: {id}, relations: {comment: true}})
        } catch (e) {
            throw new Error(e.message);
        }
    }
    async userSubscribeCategory(categoryId: number, userId: number) {
        try {
            const foundUser = await this.userRepository.findOne({ where: { id: userId }, relations: {categories: true} });
            if (!foundUser) {
                throw new Error('User not found');
            }
            const foundCategory = await this.categoryRepository.findOne({ where: { id: categoryId } });
            if (!foundCategory) {
                throw new Error('Category not found');
            }
            foundUser.categories.push(foundCategory);
            return await this.userRepository.save(foundUser);
        } catch (e) {
            throw new Error(e);
        }
    }
    async getUsersByCategory(categoryId: number) {
        try {
            const users = await this.userRepository
                .createQueryBuilder('user')
                .innerJoinAndSelect('user.categories', 'category')
                .where('category.id = :categoryId', { categoryId })
                .getMany();
            return users;
        } catch (e) {
            console.error("Error in getUsersByCategory:", e);
            throw new Error(e);
        }
    }
}