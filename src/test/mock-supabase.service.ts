import { Injectable } from '@nestjs/common';

@Injectable()
export class MockSupabaseService {
  public client = {
    auth: {
      admin: {
        createUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'mock-user-id' } },
          error: null,
        }),
        getUserById: jest.fn().mockResolvedValue({
          data: { user: { id: 'mock-user-id' } },
          error: null,
        }),
      },
      signInWithPassword: jest.fn().mockResolvedValue({
        data: {
          user: { id: 'mock-user-id' },
          session: { access_token: 'mock-token' },
        },
        error: null,
      }),
    },
  };

  async createUser(user: any) {
    return { id: 'mock-user-id' };
  }

  async getUserUsingToken(token: string) {
    return { id: 'mock-user-id', email: 'test@example.com' };
  }

  async login(user: any) {
    return 'mock-access-token';
  }
}
