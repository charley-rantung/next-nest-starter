import * as z from 'zod';
import { UserCreateSchema, UserDetailSchema, UserListSchema, UserUpdateOwnPasswordSchema, UserUpdateSchema } from '@starter-pack/api-contracts';

// Create
export type UserCreateBody = z.output<typeof UserCreateSchema.body>;

// List
export type UserListQuery = z.output<typeof UserListSchema.query>;

// Detail
export type UserDetailParams = z.output<typeof UserDetailSchema.params>;

// Update
export type UserUpdateParams = z.output<typeof UserUpdateSchema.params>;
export type UserUpdateBody = z.output<typeof UserUpdateSchema.body>;

// Update own password
export type UserUpdateOwnPasswordBody = z.output<typeof UserUpdateOwnPasswordSchema.body>;
