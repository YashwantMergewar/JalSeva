export type AuthUserType = 'citizen' | 'employee';

export type AuthenticatedUser = {
  id: string;
  userType: AuthUserType;
  roleId: string | null;
};

