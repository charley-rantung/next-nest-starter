import { PermissionListSchema } from '@starter-pack/api-contracts';
import * as z from 'zod';

export type PermissionListQuery = z.output<typeof PermissionListSchema.query>;
