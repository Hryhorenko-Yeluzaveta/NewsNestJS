import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Category} from "../Category/category.entity";
import {Comment} from "../Comment/comment.entity";
import {User} from "../User/user.entity";



@Entity('news')
export class News {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'name', type: 'varchar'})
    name: string

    @Column({ name: 'image', type: 'varchar', nullable: true})
    imageSrc: string

    @Column({ name: 'text', type: 'varchar', nullable: true})
    text: string

    @ManyToOne(() => User, (user) => user.news, {nullable: false})
    author: User

    @CreateDateColumn({name: 'date'})
    date: Date

    @ManyToOne(() => Category, (category) => category.news, {nullable: false})
    category: Category

    @OneToMany(() => Comment, (comment) => comment.news, {nullable: true})
    comment: Comment[]

}