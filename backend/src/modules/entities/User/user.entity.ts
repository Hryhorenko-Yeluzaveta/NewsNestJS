import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from "../Category/category.entity";
import { Comment } from "../Comment/comment.entity";
import { News } from "../News/news.entity";
import { Role } from "../Auth/enum/role.enum";
import {Message} from "../Message/message.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'email', type: 'varchar', unique: true })
    email: string;

    @Column({ name: 'password', type: 'varchar' })
    password: string;

    @Column({ name: 'username', type: 'varchar', unique: true })
    username: string;

    @Column({ name: 'roles', type: 'enum', enum: Role, array: true, default: [Role.User] })
    roles: Role[];

    @OneToMany(() => Comment, (comment) => comment.user, { nullable: true })
    comment: Comment[];

    @OneToMany(() => News, (news) => news.author, { nullable: true })
    news: News[];

    @OneToMany(() => Message, (message) => message.user, { nullable: true })
    message: Message[];

    @ManyToMany(() => Category, {nullable: true})
    @JoinTable()
    categories: Category[]
}