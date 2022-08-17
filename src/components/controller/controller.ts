import { Api } from './api';
import AppModel from '../app/app';
import { CallbackFunction } from '../types/types';

class Controller {
  private model: AppModel;

  private api: Api;

  private dictionaryPage = 0;

  private dictionaryGroup = 0;

  private maxDictionaryPage = 29;

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
    })
  }

  public setDictionaryPage(value: number) {
    if (value < 0) {
      this.dictionaryPage = 0;
    } else if (value > this.maxDictionaryPage) {
      this.dictionaryPage = this.maxDictionaryPage;
    } else {
      this.dictionaryPage = value;
    }
    this.updateDictionary();
  }

  public getDictionaryPage() {
    return this.dictionaryPage;
  }

  public getMaxDictionaryPage() {
    return this.maxDictionaryPage;
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
