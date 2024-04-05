import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendEmail(recieverEmail: string, subject: string, content: string) {
        try {
            await this.mailerService.sendMail({
                to: recieverEmail,
                subject: subject,
                html: content
            })
            return true;
        } catch (e) {
            console.error('Error sending email: ', e)
            return false
        }
    }
}
