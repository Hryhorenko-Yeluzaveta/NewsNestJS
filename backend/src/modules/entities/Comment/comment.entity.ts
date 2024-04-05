import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {News} from "../News/news.entity";
import {User} from "../User/user.entity";



@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'text', type: 'varchar'})
    text: string

    @CreateDateColumn({name: 'date'})
    date: Date

    @ManyToOne(() => News, (news) => news.comment)
    news: News

    @ManyToOne(() => User, (user) => user.comment)
    user: User
}