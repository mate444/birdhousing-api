export enum UserStatusEnum {
  active = 'active',
  inactive = 'inactive'
}

export enum UserRoleEnum {
  admin = 'admin',
  client = 'client'
}

export interface IUserPermission {
  id: number;
  permission: string;
}

export interface IUserRole {
  id: number;
  rolename: string;
  permissions: IUserPermission[];
}

export interface IUserAddress {
  id: number;
  userId: string;
  address: string;
  name: string;
  lastname: string;
  country: string;
  city: string;
  phoneNumber: string;
  postalCode: string;
}

export interface IUserInterface {
  id: string;
  password: string;
  email: string;
  country: string;
  roleId: IUserRole;
  addresses: IUserAddress[]
}
