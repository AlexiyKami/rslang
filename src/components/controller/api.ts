import settings from '../settings';
import {
  CreateUserData,
  CreateUserErrors,
  DeleteUserData,
  GetUpdateUserData,
  GetUserTokensData,
  Word,
} from '../types/types';

export class Api {
  private readonly baseUrl: string;

  private readonly wordsUrl: string;

  private readonly usersUrl: string;

  constructor() {
    this.baseUrl = settings.DATABASE_URL;
    this.wordsUrl = this.baseUrl + '/words';
    this.usersUrl = this.baseUrl + '/users';
  }

  // WORDS

  public async getWords(pageNumber: number, groupNumber: number): Promise<Word[] | string> {
    try {
      const response = await fetch(`${this.wordsUrl}?page=${pageNumber}&group=${groupNumber}`);
      return await response.json();
    } catch {
      return `Sorry. Can't load words.`;
    }
  }

  public async getWord(id: string): Promise<Word | string> {
    try {
      const response = await fetch(`${this.wordsUrl}/${id}`);
      return await response.json();
    } catch {
      return `Sorry. Can't load word.`;
    }
  }

  // SIGN IN

  public async userSingIn(email: string, password: string) {
    try {
      const params = {
        email,
        password,
      };
      const response = await fetch(`${this.baseUrl}/signin`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      let responseData;
      if (response.status === 200) {
        responseData = await response.json();
      } else if (response.status === 403) {
        responseData = 'Incorrect password';
      } else if (response.status === 404) {
        responseData = `Couldn't find a(an) user with ${email} email`;
      } else {
        responseData = `Can't Sign In`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't Sign In User (Server Error)`,
      };
    }
  }

  // USERS

  public async createUser(name: string, email: string, password: string): Promise<CreateUserData> {
    try {
      const params = {
        name,
        email,
        password,
      };
      const response = await fetch(`${this.usersUrl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      let responseData;
      if (response.status === 200) {
        responseData = await response.json();
      } else if (response.status === 417) {
        responseData = 'User with this e-mail exists';
      } else if (response.status === 422) {
        const error: { error: CreateUserErrors } = await response.json();
        responseData = error.error.errors;
      } else {
        responseData = `Can't create User`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't create User (Server Error)`,
      };
    }
  }

  public async getUser(userId: string, token: string): Promise<GetUpdateUserData> {
    try {
      const response = await fetch(`${this.usersUrl}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      let responseData;
      if (response.status === 200) {
        responseData = await response.json();
      } else if (response.status === 401) {
        responseData = 'Access token is missing or invalid';
      } else if (response.status === 404) {
        responseData = 'User not found';
      } else {
        responseData = `Can't get User`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't get User (Server Error)`,
      };
    }
  }

  public async updateUser(userId: string, email: string, password: string, token: string): Promise<GetUpdateUserData> {
    try {
      const params = {
        email,
        password,
      };
      const response = await fetch(`${this.usersUrl}/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      let responseData;
      if (response.status === 200) {
        responseData = await response.json();
      } else if (response.status === 401) {
        responseData = 'Access token is missing or invalid';
      } else if (response.status === 400) {
        responseData = 'Bad request';
      } else {
        responseData = `Can't update User`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't update User (Server Error)`,
      };
    }
  }

  public async deleteUser(userId: string, token: string): Promise<DeleteUserData> {
    try {
      const response = await fetch(`${this.usersUrl}/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      let responseData;
      if (response.status === 204) {
        responseData = 'The user has been deleted';
      } else if (response.status === 401) {
        responseData = 'Access token is missing or invalid';
      } else {
        responseData = `Can't update User`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't delete User (Server Error)`,
      };
    }
  }

  // TODO Check getUserTokens after Auth interface check
  public async getUserTokens(userId: string, refreshToken: string): Promise<GetUserTokensData> {
    try {
      const response = await fetch(`${this.usersUrl}/${userId}/tokens`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      let responseData;
      if (response.status === 200) {
        responseData = await response.json();
      } else if (response.status === 403) {
        responseData = 'Access token is missing, expired or invalid';
      } else {
        responseData = `Can't get User Token`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't get User Token (Server Error)`,
      };
    }
  }
}
