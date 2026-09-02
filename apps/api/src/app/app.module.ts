import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CsrfGuard } from 'src/common/guard/csrf.guard';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from 'src/common/provider/prisma/prisma.module';
import { RedisModule } from 'src/common/provider/redis/redis.module';
import { MailModule } from 'src/common/provider/mail/mail.module';
import { QueueModule } from 'src/common/provider/queue/queue.module';
import { UserModule } from './user/user.module';
import { RedisService } from 'src/common/provider/redis/redis.service';
import * as env from 'src/common/utils/env.utils';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    AppService,
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validate: env.validate,
    }),
    ThrottlerModule.forRootAsync({
      // imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => ({
        throttlers: [
          {
            ttl: 60_000,
            limit: 100,
          },
        ],
        errorMessage: 'Too many request',
        storage: new ThrottlerStorageRedisService(redisService),
      }),
    }),
    BullModule.forRootAsync({
      // imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => ({
        connection: redisService,
      }),
    }),
    PrismaModule,
    RedisModule,
    MailModule,
    QueueModule,
    UserModule,
  ],
})
export class AppModule {}
