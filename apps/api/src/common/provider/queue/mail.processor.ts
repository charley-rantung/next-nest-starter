import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Logger, OnApplicationBootstrap } from "@nestjs/common"
import { Job } from "bullmq"
import { MailService } from "src/common/provider/mail/mail.service"
import type Mail from "nodemailer/lib/mailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"

export type MailJobData = Mail.Options & Partial<SMTPTransport.Options>
export type MailJobName = "send-otp" | "send-password-changed-notification"

@Processor("mail")
export class MailProcessor extends WorkerHost implements OnApplicationBootstrap {
  private readonly logger = new Logger(MailProcessor.name)

  constructor(private readonly mailService: MailService) {
    super()
  }

  onApplicationBootstrap() {
    this.worker.on("ready", () => {
      console.info(`✅ Worker ready (queue:${this.worker.name})`)
    })

    this.worker.on("error", (err) => {
      console.error(`❌ Worker error (queue:${this.worker.name})`, err)
    })
  }

  async process(job: Job<MailJobData, undefined, MailJobName>): Promise<void> {
    this.logger.debug(`Processing mail job ${job.id}: ${job.name}`)

    await this.mailService.sendMail(job.data)
  }
}
