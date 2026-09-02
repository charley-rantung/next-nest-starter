import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma/prisma.service';
import type { Prisma } from 'src/generated/prisma/client';
import type { Role, Roles } from '@starter-pack/api-contracts';
import type { RoleCreateBody, RoleDeleteParams, RoleDetailParams, RoleListQuery, RoleUpdateBody, RoleUpdateParams } from './role.types';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) {}

  async create(body: RoleCreateBody): Promise<Role> {
    const role = await this.prismaService.role.create({
      data: {
        name: body.name,
        description: body.description,
        ...(body.permissions && {
          permissions: {
            connect: body.permissions.map((id) => ({ id })),
          },
        }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        permissions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return role;
  }

  async findAll(query: RoleListQuery): Promise<[Roles, number]> {
    const filter: Prisma.roleWhereInput = {
      ...(query.search && {
        OR: [
          {
            name: {
              mode: 'insensitive',
              contains: query.search,
            },
          },
          {
            description: {
              mode: 'insensitive',
              contains: query.search,
            },
          },
        ],
      }),
    };

    const [roles, total] = await this.prismaService.$transaction([
      this.prismaService.role.findMany({
        where: filter,
        select: {
          id: true,
          name: true,
          description: true,
        },
        take: query.size,
        skip: query.size * (query.page - 1),
      }),
      this.prismaService.role.count({
        where: filter,
      }),
    ]);

    return [roles, total];
  }

  async findOne(param: RoleDetailParams): Promise<Role | null> {
    const role = await this.prismaService.role.findUnique({
      where: {
        id: param.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        permissions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return role;
  }

  async update(param: RoleUpdateParams, body: RoleUpdateBody): Promise<Role> {
    const role = await this.prismaService.role.update({
      where: {
        id: param.id,
      },
      data: {
        name: body.name,
        description: body.description,
        ...(body.permissions && {
          permissions: {
            set: body.permissions.map((id) => ({ id })),
          },
        }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        permissions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return role;
  }

  async delete(param: RoleDeleteParams): Promise<Omit<Role, 'permissions'>> {
    const role = await this.prismaService.role.delete({
      where: {
        id: param.id,
      },
    });

    return role;
  }
}
