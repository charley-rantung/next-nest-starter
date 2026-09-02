import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PermissionGuard, Permissions } from 'src/common/guard/permission.guard';
import { UserService } from './user.service';
import { ZodPipe } from 'src/common/pipe/zod.pipe';
import { Session } from 'src/common/decorator/session.decorator';
import {
  UserCreateSchema,
  UserDetailSchema,
  UserListSchema,
  UserUpdateOwnPasswordSchema,
  UserUpdateSchema,
  type AccessTokenPayload,
  type UserCreateResponse,
  type UserDetailResponse,
  type UserListResponse,
  type UserUpdateOwnPasswordResponse,
  type UserUpdateResponse,
} from '@starter-pack/api-contracts';
import type { UserCreateBody, UserDetailParams, UserListQuery, UserUpdateBody, UserUpdateOwnPasswordBody, UserUpdateParams } from './user.types';

@Controller('users')
@UseGuards(PermissionGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Permissions(['user:create'])
  async create(
    @Body(new ZodPipe(UserCreateSchema.body))
    body: UserCreateBody,
    @Session()
    session: AccessTokenPayload,
  ): Promise<UserCreateResponse> {
    const user = await this.userService.create(body, session.sub);

    return {
      requestId: '',
      success: true,
      data: user,
      message: 'User created successfully',
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Get()
  @Permissions(['user:read'])
  async findAll(
    @Query(new ZodPipe(UserListSchema.query))
    query: UserListQuery,
  ): Promise<UserListResponse> {
    const [users, total] = await this.userService.findAll(query);

    return {
      requestId: '',
      success: true,
      data: users,
      message: 'Users found',
      meta: {
        timestamp: Date.now(),
        page: query.page,
        size: query.size,
        count: users.length,
        total,
      },
    };
  }

  @Get('me')
  @Permissions()
  async getMe(
    @Session()
    session: AccessTokenPayload,
  ): Promise<UserDetailResponse> {
    const user = await this.userService.getMe(session.sub);

    return {
      requestId: '',
      success: true,
      data: user,
      message: 'User found',
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Get(':uid')
  @Permissions(['user:read'])
  async findOne(
    @Param(new ZodPipe(UserDetailSchema.params))
    params: UserDetailParams,
  ): Promise<UserDetailResponse> {
    const user = await this.userService.findOne(params.uid);

    return {
      requestId: '',
      success: true,
      data: user,
      message: 'User found',
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Patch('me/password')
  @Permissions()
  async updateMyPassword(
    @Body(new ZodPipe(UserUpdateOwnPasswordSchema.body))
    body: UserUpdateOwnPasswordBody,
    @Session()
    session: AccessTokenPayload,
  ): Promise<UserUpdateOwnPasswordResponse> {
    await this.userService.updateMyPassword(session.sub, body);

    return {
      requestId: '',
      success: true,
      data: null,
      message: 'Password updated successfully',
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Patch(':uid')
  @Permissions(['user:update'])
  async update(
    @Param(new ZodPipe(UserUpdateSchema.params))
    params: UserUpdateParams,
    @Body(new ZodPipe(UserUpdateSchema.body))
    body: UserUpdateBody,
    @Session()
    session: AccessTokenPayload,
  ): Promise<UserUpdateResponse> {
    const user = await this.userService.update(params.uid, body, session.sub);

    return {
      requestId: '',
      success: true,
      data: user,
      message: 'User updated successfully',
      meta: {
        timestamp: Date.now(),
      },
    };
  }
}
