import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { EnvType } from 'src/common/utils/env.utils';

@Injectable()
export class RedisService extends Redis {
  constructor(configService: ConfigService<EnvType, true>) {
    super(configService.get('REDIS_URL', { infer: true }));

    this.on('connect', () => {
      console.info('✅ Redis connected');
    });
  }
}
