export interface User {
  id: string;
  username: string;
  email: string;
  roles: any[];
  password?: string;
  active: boolean;
  allRoles?: any[],
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
