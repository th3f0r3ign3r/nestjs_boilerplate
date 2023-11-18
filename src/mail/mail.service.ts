import { MailOptionsType, mailOptions } from '@/lib/validation';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import handlebars from 'handlebars';
import * as fs from 'fs';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  private readonly transporter = nodemailer.createTransport({
    host: this.configService.get<string>('SMTP_HOST'),
    port: parseInt(this.configService.get<string>('SMTP_PORT')),
    auth: {
      user: this.configService.get<string>('SMTP_USER'),
      pass: this.configService.get<string>('SMTP_PASSWORD'),
    },
    secure: true,
  });

  private readonly sender = this.configService.get<string>('MAIL_SENDER');
  private readonly senderName = this.configService.get<string>('MAIL_FROM');

  private templateExt = '.hbs';
  private templateFilesPath = __dirname + '/templates/';

  async sendMail(options: MailOptionsType) {
    try {
      const mail = mailOptions.parse(options);
      mail.from = `${mail.from} <${this.sender}>`;
      await this.transporter.sendMail(mail);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  getTemplate(name: string, templateData: any) {
    const templateSource = fs.readFileSync(
      this.templateFilesPath + name + this.templateExt,
      'utf8',
    );
    const template = handlebars.compile(templateSource);
    return template(templateData);
  }

  async sendTemplateMail(
    template: string,
    templateData: any,
    options: Partial<MailOptionsType>,
  ) {
    try {
      options.from = `${this.senderName} <${this.sender}>`;
      options.html = this.getTemplate(template, templateData);
      const mail = mailOptions.parse(options);
      await this.transporter.sendMail(mail);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  sendVerifyEmail(email: string, token: string) {
    const template = 'verify-email';
    const templateData = { token };
    const mailOptions = {
      to: email,
      subject: 'Verify your email',
    };
    return this.sendTemplateMail(template, templateData, mailOptions);
  }
}
