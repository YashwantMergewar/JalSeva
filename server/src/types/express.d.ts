declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userType: "CITIZEN" | "EMPLOYEE";
        roleId: string | null;
      };
    }
  }
}

export {};
