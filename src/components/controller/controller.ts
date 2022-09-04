import { Api } from './api';
import AppModel from '../app/app';
import settings from '../settings';
import { getElement } from '../utils/utils';
import DictionaryController from './dictionaryController';
import { AppState, CallbackFunction, Word } from '../types/types';
import AudioChallengeController from './audioChallengeController';
import SprintController from './sprintController';
import AuthorizationController from './authorizationController';
import NavController from './navController';
import StatisticController from './statisticController';
import '../../assets/sounds/correct.mp3';
import '../../assets/sounds/wrong.mp3';
import '../../assets/sounds/end.mp3';

class Controller {
  public model: AppModel;
  public dictionary: DictionaryController;
  public api: Api;
  public audioChallengeController: AudioChallengeController;
  public sprintController: SprintController;
  public authorizationController: AuthorizationController;
  public onLoadingPopup: CallbackFunction[];
  public navController: NavController;
  public statisticController: StatisticController;

  constructor(model: AppModel) {
    this.model = model;
    this.api = new Api();
    this.audioChallengeController = new AudioChallengeController(this, this.model);
    this.sprintController = new SprintController(this, this.model);
    this.dictionary = new DictionaryController(this);
    this.authorizationController = new AuthorizationController(this);
    this.navController = new NavController(this);
    this.onLoadingPopup = [];
    this.statisticController = new StatisticController(this);
  }

  public playStopAudio(fileName: string, startPlay = true, isOnServer = true): void {
    const audio = getElement('app-audio') as HTMLAudioElement;
    if (startPlay) {
      audio.src = isOnServer ? `${settings.DATABASE_URL}/${fileName}` : fileName;
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  public onAudioEnded(cb: CallbackFunction): void {
    const audio = getElement('app-audio') as HTMLAudioElement;
    audio.onended = cb;
  }

  public async getWords(group: number, page: number): Promise<string | Word[]> {
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
