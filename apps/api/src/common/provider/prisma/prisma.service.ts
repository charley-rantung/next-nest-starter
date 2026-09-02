import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import type { EnvType } from 'src/common/utils/env.utils';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService<EnvType, true>) {
    super({
      adapter: new PrismaPg({
        connectionString: configService.get('DATABASE_URL'),
      }),
      log: [
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect(); // Start the engine
      await this.$queryRaw`SELECT 1`; // Real connection
      console.info('✅ Database connected successfully');
    } catch (err) {
      console.error('❌ Failed to connect to the database: ', err);
      process.exit(1);
    }
  }
}
