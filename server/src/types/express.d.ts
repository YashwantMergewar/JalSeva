declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userType: "citizen" | "employee";
        roleId: string | null;
      };
    }
  }
}

export {};
