import { Module } from '@nestjs/common'
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm'


@Module({
    imports: [
        NestTypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'nest_test',
            password: 'nest_test',
            database: 'nest_test',
            entities: [ 'dist/modules/entities/**/*.entity.js' ],
            synchronize: true
            // migrations: [ 'dist/db/migrations/**/*.js' ],
            // cli: { migrationsDir: 'src/db/migrations' },
        })
    ]
})
export class TypeOrmModule {}