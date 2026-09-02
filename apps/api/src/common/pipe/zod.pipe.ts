import { Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: any) {
    return this.schema.parse(value);
  }
}
