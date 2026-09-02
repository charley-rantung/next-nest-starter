import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from 'src/common/provider/mail/mail.service';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export type MailJobData = Mail.Options & Partial<SMTPTransport.Options>;
export type MailJobName = 'send-otp' | 'send-password-changed-notification';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<MailJobData, undefined, MailJobName>): Promise<void> {
    this.logger.debug(`Processing mail job ${job.id}: ${job.name}`);

    await this.mailService.sendMail(job.data);
  }
}
