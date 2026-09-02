import { RoleCreateSchema, RoleDeleteSchema, RoleDetailSchema, RoleListSchema, RoleUpdateSchema } from '@starter-pack/api-contracts';
import * as z from 'zod';

// Create
export type RoleCreateBody = z.output<typeof RoleCreateSchema.body>;

// List
export type RoleListQuery = z.output<typeof RoleListSchema.query>;

// Detail
export type RoleDetailParams = z.output<typeof RoleDetailSchema.params>;

// Update
export type RoleUpdateParams = z.output<typeof RoleUpdateSchema.params>;
export type RoleUpdateBody = z.output<typeof RoleUpdateSchema.body>;

// Delete
export type RoleDeleteParams = z.output<typeof RoleDeleteSchema.params>;
