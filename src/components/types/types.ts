// API

interface InitWord {
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}

export interface Word extends InitWord {
  id: string;
}

export interface WordUnderscore extends InitWord {
  _id: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface Auth {
  token: string;
  refreshToken: string;
}

interface UserWord {
  difficulty: string;
  id: string;
  wordId: string;
}

interface StatisticsData {
  id: string;
  learnedWords: number;
  optional?: Optional;
}

export interface CreateUserError {
  path: string[];
  message: string;
}

export interface CreateUserErrors {
  status: string;
  errors: CreateUserError[];
}

export interface GetAllUserAggregatedWordsData {
  paginatedResults: WordUnderscore[];
  totalCount: [
    {
      count: number;
    }
  ];
}

export type Optional = Record<string, unknown>;

interface ApiMethodsData {
  code: number;
}

export interface CreateUserData extends ApiMethodsData {
  data: User | CreateUserErrors | string;
}

export interface GetUpdateUserData extends ApiMethodsData {
  data: User | string;
}

export interface DeleteUserWordData extends ApiMethodsData {
  data: string;
}

export interface GetUserTokensData extends ApiMethodsData {
  data: Auth | string;
}

export interface GetAllUserWordsData extends ApiMethodsData {
  data: UserWord[] | string;
}

export interface UserWordData extends ApiMethodsData {
  data: UserWord | string;
}

export interface GetUserAggregatedWord extends ApiMethodsData {
  data: WordUnderscore[] | string;
}

export interface GetUpsertStatistics extends ApiMethodsData {
  data: StatisticsData | string;
}

export interface GetAllUserAggregatedWords extends ApiMethodsData {
  data: GetAllUserAggregatedWordsData | string;
}

export type CallbackFunction = () => void;

export interface AudioChallengeModelState {
  currentWords: Word[];
  currentWordPlayedCount: number;
  currentWordIndex: number;
  currentGuessingWords: Word[];
  rightWords: string[];
  wrongWords: string[];
}
