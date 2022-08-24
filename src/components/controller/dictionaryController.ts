import { GetAllUserAggregatedWordsData } from './../types/types';
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
          `{"$or":[{ "userWord.difficulty": "difficult"}]}`,
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
    if ((await this.baseController.api.getsUserWord(userId, wordId, token)).code === 404) {
      if (this.getDictionaryGroup() !== 6) {
        response = await this.baseController.api.createUserWord(userId, wordId, difficulty, {}, token);
        console.log(response);
      }
    } else {
      if (this.getDictionaryGroup() !== 6) {
        response = await this.baseController.api.updateUserWord(userId, wordId, difficulty, {}, token);
        console.log(response);
      } else {
        response = await this.baseController.api.updateUserWord(userId, wordId, 'easy', {}, token);
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
