import {Body, Controller, Post} from "@nestjs/common";
import {MailService} from "./mail.service";

@Controller('email')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post('send')
    async sendEmail(
        @Body() emailData: {to: string, subject: string, content: string},
    ) {
        const {to, subject, content} = emailData
        const emailSend = await this.mailService.sendEmail(to, subject,content)
        if(emailSend) {
            return {message: 'Email send successfully'}
        } else {
            return {message: 'Failed to send email'}
        }
    }
}
