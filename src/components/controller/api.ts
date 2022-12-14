import settings from '../settings';
import {
  CreateUserData,
  GetUpsertStatistics,
  GetUserTokensData,
  UserWordData,
  Word,
  GetAllUserAggregatedWordsData,
  GetAllUserAggregatedWords,
  GetAllUserWordsData,
  WordOptional,
  StatisticsOptional,
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

  public async getWords(groupNumber: number, pageNumber = 0): Promise<Word[] | string> {
    try {
      const response = await fetch(`${this.wordsUrl}?page=${pageNumber}&group=${groupNumber}`);
      return await response.json();
    } catch {
      return `Sorry. Can't load words.`;
    }
  }

  // SIGN IN

  public async userSignIn(email: string, password: string) {
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
        responseData = 'Incorrect e-mail or password';
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

  // USERS/WORDS

  public async getAllUserWords(userId: string, token: string): Promise<GetAllUserWordsData> {
    try {
      const response = await fetch(`${this.usersUrl}/${userId}/words`, {
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
        responseData = 'Unauthorized';
      } else if (response.status === 402) {
        responseData = 'Access token is missing or invalid';
      } else {
        responseData = `Can't get All User Words`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't get All User Words (Server Error)`,
      };
    }
  }

  public async createUserWord(
    userId: string,
    wordId: string,
    difficulty: string,
    optional: WordOptional,
    token: string
  ): Promise<UserWordData> {
    try {
      const params = {
        difficulty,
        optional,
      };
      const response = await fetch(`${this.usersUrl}/${userId}/words/${wordId}`, {
        method: 'POST',
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
      } else if (response.status === 400) {
        responseData = 'Bad request';
      } else if (response.status === 401) {
        responseData = 'Access token is missing or invalid';
      } else {
        responseData = `Can't create User Word`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't create User Word (Server Error)`,
      };
    }
  }

  public async getsUserWord(userId: string, wordId: string, token: string): Promise<UserWordData> {
    try {
      const response = await fetch(`${this.usersUrl}/${userId}/words/${wordId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      let responseData;
      if (response.status === 200) {
        responseData = await response.json();
      } else if (response.status === 400) {
        responseData = 'Bad request';
      } else if (response.status === 401) {
        responseData = `Access token is missing or invalid`;
      } else {
        responseData = `Can't get User Word`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't get User Word (Server Error)`,
      };
    }
  }

  public async updateUserWord(
    userId: string,
    wordId: string,
    difficulty: string,
    optional: WordOptional,
    token: string
  ): Promise<UserWordData> {
    try {
      const params = {
        difficulty,
        optional,
      };
      const response = await fetch(`${this.usersUrl}/${userId}/words/${wordId}`, {
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
      } else if (response.status === 400) {
        responseData = 'Bad request';
      } else if (response.status === 401) {
        responseData = `Access token is missing or invalid`;
      } else {
        responseData = `Can't update User Word`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't update User Word (Server Error)`,
      };
    }
  }

  // USERS/AggregatedWords

  public async getAllUserAggregatedWords(
    userId: string,
    token: string,
    filter?: string,
    page?: number,
    group?: number,
    wordsPerPage?: number
  ): Promise<GetAllUserAggregatedWords> {
    try {
      const wordsPerPageParams = wordsPerPage
        ? `wordsPerPage=${wordsPerPage}&`
        : `wordsPerPage=${settings.WORDS_PER_PAGE}&`;
      const pageParams = page !== undefined ? `page=${page}&` : ``;
      const filterParams = filter ? `filter=${filter}&` : ``;
      const groupParams = group !== undefined ? `group=${group}&` : ``;
      const response = await fetch(
        `${this.usersUrl}/${userId}/aggregatedWords?${groupParams}${pageParams}&${wordsPerPageParams}${filterParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      let responseData;
      if (response.status === 200) {
        responseData = ((await response.json()) as GetAllUserAggregatedWordsData[])[0];
      } else if (response.status === 401) {
        responseData = `Access token is missing or invalid`;
      } else {
        responseData = `Can't get All User Aggregated Words`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't get get All User Aggregated Words (Server Error)`,
      };
    }
  }

  // USERS/STATISTIC

  public async getStatistics(userId: string, token: string): Promise<GetUpsertStatistics> {
    try {
      const response = await fetch(`${this.usersUrl}/${userId}/statistics`, {
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
        responseData = `Access token is missing or invalid`;
      } else if (response.status === 404) {
        responseData = `Statistics not found`;
      } else {
        responseData = `Can't get Statistics`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't get Statistics (Server Error)`,
      };
    }
  }

  public async upsertStatistics(
    userId: string,
    learnedWords: number,
    optional: StatisticsOptional,
    token: string
  ): Promise<GetUpsertStatistics> {
    try {
      const params = {
        learnedWords,
        optional,
      };
      const response = await fetch(`${this.usersUrl}/${userId}/statistics`, {
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
      } else if (response.status === 400) {
        responseData = 'Bad request';
      } else if (response.status === 401) {
        responseData = `Access token is missing or invalid`;
      } else {
        responseData = `Can't upsert Statistics`;
      }
      return {
        code: response.status,
        data: responseData,
      };
    } catch {
      return {
        code: 0,
        data: `Can't upsert Statistics (Server Error)`,
      };
    }
  }
}
