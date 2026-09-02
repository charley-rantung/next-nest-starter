import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionGuard, Permissions } from 'src/common/guard/permission.guard';
import { PermissionService } from './permission.service';
import { ZodPipe } from 'src/common/pipe/zod.pipe';
import { PermissionListSchema, type PermissionListResponse } from '@starter-pack/api-contracts';
import type { PermissionListQuery } from './permission.types';

@Controller('user-permissions')
@UseGuards(PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Permissions(['user.permission:read'])
  async findAll(
    @Query(new ZodPipe(PermissionListSchema.query))
    query: PermissionListQuery,
  ): Promise<PermissionListResponse> {
    const [permissions, total] = await this.permissionService.findAll(query);

    return {
      requestId: '',
      success: true,
      message: 'Permissions found',
      data: permissions,
      meta: {
        timestamp: Date.now(),
        page: query.page,
        size: query.size,
        count: permissions.length,
        total,
      },
    };
  }
}
