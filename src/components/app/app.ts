import Controller from '../controller/controller';
import View from '../view/view';
import AudioChallengeModel from './audioChallengeModel';
import { AppState } from '../types/types';

class AppModel {
  public controller: Controller;
  public view: View;
  public audioChallengeModel: AudioChallengeModel;
  public state: AppState;

  constructor() {
    this.state = JSON.parse(localStorage.getItem('RSSLang-state') || '{}');
    this.controller = new Controller(this);
    this.view = new View(this.controller);
    this.audioChallengeModel = new AudioChallengeModel(this.view);
  }

  public saveState(): void {
    localStorage.setItem('RSSLang-state', JSON.stringify(this.state));
  }
}

export default AppModel;
