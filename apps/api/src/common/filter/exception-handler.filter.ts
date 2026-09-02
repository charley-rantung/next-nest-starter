import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { AppException } from '../exceptions/app.exception';
import { Prisma } from 'src/generated/prisma/client';
import { ZodError } from 'zod';
import { JOSEError, JWSSignatureVerificationFailed, JWTExpired } from 'jose/errors';
import type { Response } from 'express';
import type { ApiErrorResponse } from '@starter-pack/api-contracts';

@Catch()
export class ExceptionHandlerFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const requestId = (res.locals.requestId as string) || '';

    if (exception instanceof AppException) {
      res.status(exception.getStatus()).json({
        requestId,
        success: false,
        status: exception.getStatus(),
        message: exception.message,
        error: {
          code: exception.code,
        },
      } satisfies ApiErrorResponse);
    } else if (exception instanceof HttpException) {
      res.status(exception.getStatus()).json({
        requestId,
        success: false,
        status: exception.getStatus(),
        message: exception.message,
        error: {
          code: '',
        },
      } satisfies ApiErrorResponse);
    } else if (exception instanceof ZodError) {
      res.status(400).json({
        requestId,
        success: false,
        status: 400,
        message: 'Validation error',
        error: {
          code: '',
          details: JSON.stringify(exception.issues),
        },
      } satisfies ApiErrorResponse);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({
        requestId,
        success: false,
        status: 400,
        message: 'Bad Input',
        error: {
          code: '',
        },
      } satisfies ApiErrorResponse);
    } else if (exception instanceof JOSEError) {
      if (exception instanceof JWSSignatureVerificationFailed) {
        res.status(401).json({
          requestId,
          success: false,
          status: 401,
          message: 'Invalid token',
          error: {
            code: '',
          },
        } satisfies ApiErrorResponse);
      } else if (exception instanceof JWTExpired) {
        res.status(401).json({
          requestId,
          success: false,
          status: 401,
          message: 'Token has expired',
          error: {
            code: '',
          },
        } satisfies ApiErrorResponse);
      }
    } else {
      res.status(500).json({
        requestId,
        success: false,
        status: 500,
        message: 'Internal server error',
        error: {
          code: '',
        },
      } satisfies ApiErrorResponse);
    }
  }
}
