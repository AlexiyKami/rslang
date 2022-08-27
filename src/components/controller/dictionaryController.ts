import { GetAllUserAggregatedWordsData, UserWord } from './../types/types';
import settings from '../settings';
import { CallbackFunction } from '../types/types';
import Controller from './controller';

class DictionaryController {
  baseController: Controller;
  private dictionaryPage = 0;
  private dictionaryGroup = 0;
  public onDictionaryUpdate: CallbackFunction[];

  constructor(controller: Controller) {
    this.baseController = controller;
    this.onDictionaryUpdate = [];
  }

  public async getWords() {
    const isAuthorized = this.baseController.isAuthorized();
    if (isAuthorized) {
      const state = this.baseController.getState();
      if (this.dictionaryGroup === 6) {
        const response = await this.baseController.api.getAllUserAggregatedWords(
          state.userId as string,
          state.token as string,
          `{"$or":[{ "userWord.difficulty": "hard"}]}`,
          undefined,
          undefined,
          settings.COUNT_OF_WORDS()
        );
        if (typeof response.data === 'string') {
          return `<p class='message'>${response.data}</p>`;
        }
        return (response.data as GetAllUserAggregatedWordsData).paginatedResults;
      } else {
        const response = await this.baseController.api.getAllUserAggregatedWords(
          state.userId as string,
          state.token as string,
          `{"$and":[{ "page": ${this.dictionaryPage} }, { "group": ${this.dictionaryGroup} }]}`
        );
        if (typeof response.data === 'string') {
          return `<p class='message'>${response.data}</p>`;
        }
        return (response.data as GetAllUserAggregatedWordsData).paginatedResults;
      }
    }
    const response = await this.baseController.getWords(this.dictionaryGroup, this.dictionaryPage);
    if (typeof response === 'string') {
      return `<p class='message'>${response}</p>`;
    }
    return response;
  }

  public async getUserWords() {
    const state = this.baseController.getState();
    const userId = state.userId as string;
    const token = state.token as string;
    const response = await this.baseController.api.getAllUserWords(userId, token);
    return response.data;
  }

  public async updateUserWord(wordId: string, difficulty: string) {
    const state = this.baseController.getState();
    const userId = state.userId as string;
    const token = state.token as string;
    let response;
    const getUserWord = await this.baseController.api.getsUserWord(userId, wordId, token);
    console.log(getUserWord);
    const initObj = {
      successfulAttempts: 0,
      failedAttempts: 0,
      inRow: 0,
      isLearned: false,
    };

    if (getUserWord.code === 404) {
      if (this.getDictionaryGroup() !== 6) {
        if (difficulty === 'hard') {
          response = await this.baseController.api.createUserWord(userId, wordId, difficulty, { ...initObj }, token);
        } else if (difficulty === 'learned') {
          response = await this.baseController.api.createUserWord(
            userId,
            wordId,
            'easy',
            { ...initObj, isLearned: true },
            token
          );
        }
        console.log(response);
      }
    } else {
      if (this.getDictionaryGroup() !== 6) {
        if (difficulty === 'hard') {
          response = await this.baseController.api.updateUserWord(
            userId,
            wordId,
            difficulty,
            { ...(getUserWord.data as UserWord).optional },
            token
          );
          console.log(response);
        } else if (difficulty === 'learned') {
          response = await this.baseController.api.updateUserWord(
            userId,
            wordId,
            'easy',
            { ...(getUserWord.data as UserWord).optional, isLearned: true },
            token
          );
          console.log(response);
        } else if (difficulty === 'easy') {
          response = await this.baseController.api.updateUserWord(
            userId,
            wordId,
            'easy',
            { ...(getUserWord.data as UserWord).optional, isLearned: false },
            token
          );
          console.log(response);
        }
      } else {
        response = await this.baseController.api.updateUserWord(
          userId,
          wordId,
          'easy',
          { ...(getUserWord.data as UserWord).optional },
          token
        );
        this.updateDictionary();
      }
    }
    return response;
  }

  public updateDictionary() {
    this.onDictionaryUpdate.forEach((fn) => {
      fn();
    });
  }

  public setDictionaryPage(value: number) {
    if (value < 0) {
      this.dictionaryPage = 0;
    } else if (value > settings.MAX_DICTIONARY_PAGES) {
      this.dictionaryPage = settings.MAX_DICTIONARY_PAGES;
    } else {
      this.dictionaryPage = value;
    }
    this.updateDictionary();
  }

  public getDictionaryPage() {
    return this.dictionaryPage;
  }

  public getMaxDictionaryPage() {
    return settings.MAX_DICTIONARY_PAGES;
  }

  public setDictionaryGroup(value: number) {
    this.dictionaryGroup = value;
    this.dictionaryPage = 0;
    this.updateDictionary();
  }

  public getDictionaryGroup() {
    return this.dictionaryGroup;
  }
}

export default DictionaryController;
