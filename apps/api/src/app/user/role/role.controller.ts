import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PermissionGuard, Permissions } from 'src/common/guard/permission.guard';
import { RoleService } from './role.service';
import { ZodPipe } from 'src/common/pipe/zod.pipe';
import {
  RoleCreateSchema,
  RoleDeleteSchema,
  RoleDetailSchema,
  RoleListSchema,
  RoleUpdateSchema,
  type RoleCreateResponse,
  type RoleDeleteResponse,
  type RoleDetailResponse,
  type RoleListResponse,
  type RoleUpdateResponse,
} from '@starter-pack/api-contracts';
import type { RoleCreateBody, RoleDeleteParams, RoleDetailParams, RoleListQuery, RoleUpdateBody, RoleUpdateParams } from './role.types';

@Controller('user-roles')
@UseGuards(PermissionGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @Permissions(['user.role:create'])
  async create(
    @Body(new ZodPipe(RoleCreateSchema.body))
    body: RoleCreateBody,
  ): Promise<RoleCreateResponse> {
    const role = await this.roleService.create(body);

    return {
      requestId: '',
      success: true,
      data: role,
      message: 'Role created successfully',
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Get()
  @Permissions(['user.role:read'])
  async findAll(
    @Query(new ZodPipe(RoleListSchema.query))
    query: RoleListQuery,
  ): Promise<RoleListResponse> {
    const [roles, total] = await this.roleService.findAll(query);

    return {
      requestId: '',
      success: true,
      data: roles,
      message: 'Roles found',
      meta: {
        timestamp: Date.now(),
        page: query.page,
        size: query.size,
        count: roles.length,
        total,
      },
    };
  }

  @Get(':id')
  @Permissions(['user.role:read'])
  async findOne(
    @Param(new ZodPipe(RoleDetailSchema.params))
    params: RoleDetailParams,
  ): Promise<RoleDetailResponse> {
    const role = await this.roleService.findOne(params);

    return {
      requestId: '',
      success: true,
      data: role,
      message: 'Role found',
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Patch(':id')
  @Permissions(['user.role:update'])
  async update(
    @Param(new ZodPipe(RoleUpdateSchema.params))
    params: RoleUpdateParams,
    @Body(new ZodPipe(RoleUpdateSchema.body))
    body: RoleUpdateBody,
  ): Promise<RoleUpdateResponse> {
    const role = await this.roleService.update(params, body);

    return {
      requestId: '',
      success: true,
      data: role,
      message: 'Role updated successfully',
      meta: {
        timestamp: Date.now(),
      },
    };
  }

  @Delete(':id')
  @Permissions(['user.role:delete'])
  async delete(
    @Param(new ZodPipe(RoleDeleteSchema.params))
    params: RoleDeleteParams,
  ): Promise<RoleDeleteResponse> {
    const role = await this.roleService.delete(params);

    return {
      requestId: '',
      success: true,
      data: role,
      message: 'Role deleted successfully',
      meta: {
        timestamp: Date.now(),
      },
    };
  }
}
