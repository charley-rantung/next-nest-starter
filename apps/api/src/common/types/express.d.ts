import type { AccessTokenPayload } from '@starter-pack/api-contracts';

declare global {
  namespace Express {
    interface Request {
      session?: AccessTokenPayload;
    }
  }
}
