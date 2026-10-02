export type AuthUserType = 'CITIZEN' | 'EMPLOYEE';

export type AuthenticatedUser = {
  id: string;
  userType: AuthUserType;
  roleId: string | null;
};

