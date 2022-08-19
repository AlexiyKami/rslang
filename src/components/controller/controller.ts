import { Api } from './api';
import AppModel from '../app/app';
import settings from '../settings';
import { getElement } from '../utils/utils';
import DictionaryController from './dictionaryController';

class Controller {
  private model: AppModel;
  private api: Api;
  public dictionary: DictionaryController;

  constructor(model: AppModel) {
    this.model = model;
    this.api = new Api();
    this.dictionary = new DictionaryController(this);
  }

  public playStopAudio(fileName: string, startPlay = true) {
    const audio = getElement('app-audio') as HTMLAudioElement;
    if (startPlay) {
      audio.src = `${settings.DATABASE_URL}${fileName}`;
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  public async getWords(page: number, group: number) {
    const response = await this.api.getWords(page, group);
    return response;
  }
}

export default Controller;
