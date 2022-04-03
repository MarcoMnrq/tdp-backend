import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/user-role.enum';

// Role-based access control (RBAC)
export const ROLES_KEY = 'role';
export const Role = (...role: UserRole[]) => SetMetadata(ROLES_KEY, role);
