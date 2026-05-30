import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
    adminSessionId?: string;
  }

  interface User {
    id: string;
    role?: string;
    adminSessionId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    adminSessionId?: string;
  }
}
