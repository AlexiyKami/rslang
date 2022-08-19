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
    const response = await this.baseController.getWords(this.dictionaryGroup, this.dictionaryPage);
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

export default DictionaryController;
