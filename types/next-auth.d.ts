import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
      verified: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
    verified: boolean;
  }
}
