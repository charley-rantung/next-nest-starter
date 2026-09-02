import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule, RoleModule, PermissionModule],
})
export class UserModule {}
