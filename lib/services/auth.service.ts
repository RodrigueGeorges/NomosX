export interface AuthService {
  signIn(email: string, password: string): Promise<{ user: any; token: string }>;
  signUp(email: string, password: string): Promise<{ user: any; token: string }>;
  signOut(): Promise<void>;
  refreshToken(): Promise<string>;
}

export class AuthServiceImpl implements AuthService {
  async signIn(email: string, password: string) {
    // Implementation
    return { user: null, token: '' };
  }

  async signUp(email: string, password: string) {
    // Implementation
    return { user: null, token: '' };
  }

  async signOut() {
    // Implementation
  }

  async refreshToken() {
    // Implementation
    return '';
  }
}

export const authService = new AuthServiceImpl();