import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../User/user.entity";
import {Repository} from "typeorm";
import {Message} from "./message.entity";

@Injectable()
export class MessageService {

    constructor( @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
                 @InjectRepository(User) private readonly userRepository: Repository<User>) {
    }
    async createMessage(messageData: Message, userId: number){
        try {
            const user = await this.userRepository.findOne({where: {id: userId}})
            if (!user) {
                throw new Error('Користувача на знайдено')
            }
            messageData.user = user
            const newMessage = this.messageRepository.create(messageData)
            return await this.messageRepository.save(newMessage)
        }
        catch (e) {
            throw new Error(`Помилка створення повідомлення: ${e}`)
        }
    }
    async getAllMessages() {
       return await this.messageRepository.find({relations: {user: true}, order: { date: 'DESC' }})
    }
 }
