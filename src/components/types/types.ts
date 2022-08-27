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

export interface AggregatedWord extends InitWord {
  _id: string;
  userWord: {
    difficulty: string;
    optional: WordOptional;
  };
}

export interface WordOptional {
  successfulAttempts?: number;
  failedAttempts?: number;
  inRow?: number;
  isLearned?: boolean;
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

export interface UserWord {
  difficulty?: string;
  id: string;
  wordId: string;
  optional?: WordOptional;
}

export interface StatisticsData {
  id: string;
  learnedWords?: number;
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
  paginatedResults: AggregatedWord[];
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
  data: AggregatedWord[] | string;
}

export interface GetUpsertStatistics extends ApiMethodsData {
  data: StatisticsData | string;
}

export interface GetAllUserAggregatedWords extends ApiMethodsData {
  data: GetAllUserAggregatedWordsData | string;
}

export type CallbackFunction = () => void;

export interface GameState {
  rightWords: Word[];
  wrongWords: Word[];
  maxRightWordsInRow: number;
}

export interface AudioChallengeModelState extends GameState {
  currentWords: Word[];
  currentWordIndex: number;
  currentGuessingWords: Word[];
  currentRightWordsInRow: number;
}

export interface AppState {
  token?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  refreshToken?: string;
  curPage?: number;
}

export enum AudioChallengeKeycodesToHandle {
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Space',
  'Enter',
}

export interface GameStatistic {
  date: string;
  newWords: number;
  rightWords: number;
  wrongWords: number;
  maxInRow: number;
}

export interface UserWordStatistic {
  difficulty?: string;
  optional?: WordOptional;
}
