import { Api } from './api';
import AppModel from '../app/app';
import settings from '../settings';
import { getElement } from '../utils/utils';
import DictionaryController from './dictionaryController';
import { AppState, CallbackFunction } from '../types/types';
import AudioChallengeController from './audioChallengeController/audioChallengeController';
import AuthorizationController from './authorizationController';
import NavController from './navController';
import StatisticController from './statisticController';

class Controller {
  public model: AppModel;
  public dictionary: DictionaryController;
  public api: Api;
  public audioChallengeController: AudioChallengeController;
  public authorizationController: AuthorizationController;
  public onLoadingPopup: CallbackFunction[];
  public navController: NavController;
  private statisticController: StatisticController;

  constructor(model: AppModel) {
    this.model = model;
    this.api = new Api();
    this.audioChallengeController = new AudioChallengeController(this, this.model);
    this.dictionary = new DictionaryController(this);
    this.authorizationController = new AuthorizationController(this);
    this.navController = new NavController(this);
    this.onLoadingPopup = [];
    this.statisticController = new StatisticController(this);
  }

  public playStopAudio(fileName: string, startPlay = true) {
    const audio = getElement('app-audio') as HTMLAudioElement;
    if (startPlay) {
      audio.src = `${settings.DATABASE_URL}/${fileName}`;
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  public onAudioEnded(cb: CallbackFunction) {
    const audio = getElement('app-audio') as HTMLAudioElement;
    audio.onended = cb;
  }

  public async getWords(group: number, page: number) {
    const response = await this.api.getWords(group, page);
    return response;
  }

  public getState(): AppState {
    return this.model.state;
  }

  public showLoadingPopup(): void {
    this.onLoadingPopup[0]();
  }

  public hideLoadingPopup(): void {
    this.onLoadingPopup[1]();
  }

  public isAuthorized(): boolean {
    return !!this.model.state.token;
  }
}

export default Controller;
