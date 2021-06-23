import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import * as fs from 'fs';

@Injectable()
export default class EmailService {
  private readonly transporter: Mail;

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SERVICE_EMAIL,
        pass: process.env.SERVICE_EMAIL_PASSOWRD,
      },
    });
  }

  async sendEmailAsync(
    receiver: string,
    subject: string,
    username: string,
    message: string,
  ): Promise<void> {
    this.transporter.sendMail({
      from: process.env.SERVICE_EMAIL,
      to: receiver,
      subject,
      html: this.getHtmlNotification(username, message),
    });
  }

  private getHtmlNotification(username: string, message: string): string {
    const html = fs.readFileSync('./shared/password-recovery.html', {
      encoding: 'utf8',
    });
    return html.replace('{username}', username).replace('{message}', message);
  }
}
