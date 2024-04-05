import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {News} from "../News/news.entity";



@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'name', type: 'varchar', unique: true})
    name: string

    @OneToMany(() => News, (news) => news.category, {nullable: true})
    news: News[]

}