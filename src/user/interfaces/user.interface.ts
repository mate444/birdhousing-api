export enum UserStatusEnum {
  active = 'active',
  inactive = 'inactive'
}

export enum UserRoleEnum {
  admin = 'admin',
  client = 'client'
}

export interface UserPermissionInterface {
  id: number;
  permission: string;
}

export interface UserRoleInterface {
  id: number;
  rolename: string;
  permissions: UserPermissionInterface[];
}

export interface UserInterface {
  id: string;
  name: string;
  lastname: string;
  password: string;
  email: string;
  roleId: UserRoleInterface[];
}
