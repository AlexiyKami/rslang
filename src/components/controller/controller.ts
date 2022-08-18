import { Api } from './api';
import AppModel from '../app/app';
import { CallbackFunction } from '../types/types';
import settings from '../settings';

class Controller {
  private model: AppModel;

  private api: Api;

  private dictionaryPage = 0;

  private dictionaryGroup = 0;

  public onDictionaryUpdate: CallbackFunction[];

  constructor(model: AppModel) {
    this.model = model;
    this.api = new Api();
    this.onDictionaryUpdate = [];
  }

  public async getWords() {
    const response = await this.api.getWords(this.dictionaryPage, this.dictionaryGroup);
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
    this.updateDictionary();
  }

  public getDictionaryGroup() {
    return this.dictionaryGroup;
  }
}

export default Controller;
