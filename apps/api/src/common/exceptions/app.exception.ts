import { HttpException, HttpExceptionOptions } from '@nestjs/common';

/**
 * HttpException with an added 'code' property for the specific error reason
 */
export class AppException extends HttpException {
  public readonly code: string;

  constructor(status: number, message: string, code: string, options?: HttpExceptionOptions) {
    super(message, status, options);

    this.code = code;
  }
}
