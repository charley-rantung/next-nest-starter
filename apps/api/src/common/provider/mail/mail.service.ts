import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { EnvType } from 'src/common/utils/env.utils';
import type { NodemailerError } from './mail.types';

@Injectable()
export class MailService {
  private readonly transporter: ReturnType<typeof nodemailer.createTransport>;

  constructor(configService: ConfigService<EnvType, true>) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('SMTP_HOST', { infer: true }),
      port: configService.get('SMTP_PORT', { infer: true }),
      secure: false,
      auth: {
        user: configService.get('SMTP_USER', { infer: true }),
        pass: configService.get('SMTP_PASS', { infer: true }),
      },
    });
  }

  async sendMail(props: Mail.Options & Partial<SMTPTransport.Options>) {
    try {
      const info = await this.transporter.sendMail(props);

      if (info.rejected.length > 0) {
        console.warn('Some recipients were rejected:', info.rejected);
      }
    } catch (err) {
      const mailError = err as NodemailerError;

      console.log({ mailError });
    }
  }
}
