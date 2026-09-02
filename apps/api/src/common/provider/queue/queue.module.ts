/**
 * This module is used to centralize bullmq token created by BullModule.registerQueue and provide a global queue module for the application.
 * This is necessary because @nestjs/bullmq does not provide a global queue module by default.
 * By creating a global queue module, we can avoid having to import the BullModule in every module that needs to use it.
 * Instead, we can simply import the QueueModule and use the @InjectQueue() decorator to inject the queue into our services.
 */

import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
  ],
  providers: [MailProcessor],
  exports: [BullModule],
})
export class QueueModule {}
