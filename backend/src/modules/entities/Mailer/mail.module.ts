import { Module } from '@nestjs/common';
import {MailController} from "./mail.controller";
import {MailService} from "./mail.service";
import {MailerModule} from "@nestjs-modules/mailer";
import {mailerConfig} from "./mailer.config";
@Module({
    imports: [MailerModule.forRoot(mailerConfig)],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailerModule]
})

export class MailModule {}
