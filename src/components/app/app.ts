import Controller from '../controller/controller';
import View from '../view/view';
import AudioChallengeModel from './audioChallengeModel/audioChallengeModel';
import { AppState } from '../types/types';

class AppModel {
  public controller: Controller;
  public view: View;
  public audioChallengeModel: AudioChallengeModel;
  public state: AppState;

  constructor() {
    this.controller = new Controller(this);
    this.view = new View(this.controller);
    this.audioChallengeModel = new AudioChallengeModel(this.view, this);
    this.state = JSON.parse(localStorage.getItem('RSSLang-state') || '{}');
  }

  initApp(): void {
    this.view.initRender();
  }

  saveState(): void {
    localStorage.setItem('RSSLang-state', JSON.stringify(this.state));
  }
}

export default AppModel;
