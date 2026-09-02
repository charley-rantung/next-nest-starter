import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/provider/prisma/prisma.service';
import bcrypt from 'bcrypt';
import type { EnvType } from 'src/common/utils/env.utils';
import type { Prisma } from 'src/generated/prisma/client';
import type { User, Users } from '@starter-pack/api-contracts';
import type { UserCreateBody, UserListQuery, UserUpdateBody, UserUpdateOwnPasswordBody } from './user.types';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService<EnvType, true>,
    private prismaService: PrismaService,
  ) {}

  async create(body: UserCreateBody, creatorUid: string): Promise<User> {
    const hashedPassword = bcrypt.hashSync(body.password, this.configService.get('BCRYPT_SALT_ROUNDS', { infer: true }));

    const user = await this.prismaService.user.create({
      data: {
        name: body.name,
        email: body.email,
        username: body.username,
        password: hashedPassword,
        type: body.type,
        is_active: body.is_active,
        ...(body.roles && {
          roles: {
            connect: body.roles.map((id) => ({ id })),
          },
        }),
        ...(body.permissions && {
          permissions: {
            connect: body.permissions.map((id) => ({ id })),
          },
        }),
        creator: {
          connect: {
            uid: creatorUid,
          },
        },
        updater: {
          connect: {
            uid: creatorUid,
          },
        },
      },
      select: {
        uid: true,
        name: true,
        email: true,
        username: true,
        type: true,
        is_active: true,
        created_at: true,
        creator: {
          select: {
            name: true,
          },
        },
        updated_at: true,
        updater: {
          select: {
            name: true,
          },
        },
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
        permissions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  async findAll(query: UserListQuery): Promise<[Users, number]> {
    const filter: Prisma.userWhereInput = {
      NOT: { type: 'internal' },
      ...(query.search && {
        OR: [
          {
            name: {
              mode: 'insensitive',
              contains: query.search,
            },
          },
          {
            username: {
              mode: 'insensitive',
              contains: query.search,
            },
          },
        ],
      }),
      type: query.type,
      is_active: query.active,
    };

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where: filter,
        select: {
          uid: true,
          name: true,
          email: true,
          username: true,
          is_active: true,
          created_at: true,
          creator: {
            select: {
              name: true,
            },
          },
          updated_at: true,
          updater: {
            select: {
              name: true,
            },
          },
        },
        take: query.size,
        skip: query.size * (query.page - 1),
      }),
      this.prismaService.user.count({
        where: filter,
      }),
    ]);

    return [users, total];
  }

  async getMe(uid: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        NOT: { type: 'internal' },
        uid,
      },
      select: {
        uid: true,
        name: true,
        email: true,
        username: true,
        type: true,
        is_active: true,
        created_at: true,
        creator: {
          select: {
            name: true,
          },
        },
        updated_at: true,
        updater: {
          select: {
            name: true,
          },
        },
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
        permissions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  async findOne(uid: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        NOT: { type: 'internal' },
        uid,
      },
      select: {
        uid: true,
        name: true,
        email: true,
        username: true,
        type: true,
        is_active: true,
        created_at: true,
        creator: {
          select: {
            name: true,
          },
        },
        updated_at: true,
        updater: {
          select: {
            name: true,
          },
        },
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
        permissions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  async update(uid: string, body: UserUpdateBody, updaterUid: string): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        NOT: { type: 'internal' },
        uid,
      },
      data: {
        name: body.name,
        username: body.username,
        type: body.type,
        is_active: body.is_active,
        ...(body.roles && {
          roles: {
            set: body.roles.map((id) => ({ id })),
          },
        }),
        ...(body.permissions && {
          permissions: {
            set: body.permissions.map((id) => ({ id })),
          },
        }),
        updater: {
          connect: {
            uid: updaterUid,
          },
        },
      },
      select: {
        uid: true,
        name: true,
        email: true,
        username: true,
        type: true,
        is_active: true,
        created_at: true,
        creator: {
          select: {
            name: true,
          },
        },
        updated_at: true,
        updater: {
          select: {
            name: true,
          },
        },
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
        permissions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  async updateMyPassword(uid: string, body: UserUpdateOwnPasswordBody) {
    const user = await this.prismaService.user.findUnique({
      where: {
        NOT: { type: 'internal' },
        uid,
      },
      select: {
        password: true,
      },
    });
    if (!user) throw new ForbiddenException();

    /** Validate old password */

    const isAuth = bcrypt.compareSync(body.old_password, user.password);
    if (!isAuth) throw new ForbiddenException('Password do not match');

    /** Update new password */

    const hashedPassword = bcrypt.hashSync(body.new_password, this.configService.get('BCRYPT_SALT_ROUNDS', { infer: true }));

    await this.prismaService.user.update({
      where: { uid },
      data: {
        password: hashedPassword,
        updater: {
          connect: {
            uid,
          },
        },
      },
    });
  }
}
