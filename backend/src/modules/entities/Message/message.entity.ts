import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {News} from "../News/news.entity";
import {User} from "../User/user.entity";



@Entity('message')
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'text', type: 'varchar'})
    text: string

    @CreateDateColumn({name: 'date'})
    date: Date

    @ManyToOne(() => User, (user) => user.message, {nullable: false})
    user: User
}