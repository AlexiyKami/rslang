import settings from '../settings';
import { CallbackFunction, Word } from '../types/types';
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
    if (this.dictionaryGroup === 6) {
      const result: Word[] = [];
      const userWordsResponse = await this.getUserWords();
      if (typeof userWordsResponse === 'string') {
        return `<p class='message'>${userWordsResponse}</p>`;
      }
      for (const userWord of userWordsResponse) {
        if (userWord.difficulty === 'difficult') {
          const word = (await this.baseController.api.getWord(userWord.wordId)) as Word;
          result.push(word);
        }
      }
      return result.length !== 0 ? result : `<p class='message'>This group is empty.</p>`;
    }
    const response = await this.baseController.getWords(this.dictionaryGroup, this.dictionaryPage);
    if (typeof response === 'string') {
      return `<p class='message'>${response}</p>`;
    }
    return response;
  }

  public async getUserWords() {
    const userId = (localStorage.getItem('userId') as string) || settings.USER_ID; //should remove
    const token = (localStorage.getItem('token') as string) || settings.TOKEN; //should remove
    const response = await this.baseController.api.getAllUserWords(userId, token);
    return response.data;
  }

  public async updateUserWord(wordId: string, difficulty: string) {
    const userId = (localStorage.getItem('userId') as string) || settings.USER_ID; //should remove
    const token = (localStorage.getItem('token') as string) || settings.TOKEN; //should remove
    let response;
    if ((await this.baseController.api.getsUserWord(userId, wordId, token)).code === 404) {
      if (this.getDictionaryGroup() !== 6) {
        response = (await this.baseController.api.createUserWord(userId, wordId, difficulty, {}, token)).data;
        console.log(response);
      }
    } else {
      if (this.getDictionaryGroup() !== 6) {
        response = (await this.baseController.api.updateUserWord(userId, wordId, difficulty, {}, token)).data;
        console.log(response);
      } else {
        await this.baseController.api.deleteUserWord(userId, wordId, token);
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
