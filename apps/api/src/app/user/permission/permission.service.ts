import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma/prisma.service';
import type { Permissions } from '@starter-pack/api-contracts';
import type { PermissionListQuery } from './permission.types';

@Injectable()
export class PermissionService {
  constructor(private prismaService: PrismaService) {}

  async findAll(query: PermissionListQuery): Promise<[Permissions, number]> {
    const [permissions, total] = await this.prismaService.$transaction([
      this.prismaService.permission.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
        },
        take: query.size,
        skip: query.size * (query.page - 1),
      }),
      this.prismaService.permission.count(),
    ]);

    return [permissions, total];
  }
}
