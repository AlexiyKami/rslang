import Controller from '../controller/controller';
import Dictionary from './dictionary/dictionary';
import Navigation from './navigation/navigation';
import Authorization from './authorization/authorization';
import AudioChallengeView from './audioChallenge/audioChallengeView';
import MinigamesPageView from './minigamesPage/minigamesPageView';
import { getElement } from '../utils/utils';
import LoadingPopup from './loading-popup/loadingPopup';

class View {
  public dictionary: Dictionary;
  public audioChallenge: AudioChallengeView;
  public navigation: Navigation;
  public authorization: Authorization;
  public MinigamesPage: MinigamesPageView;
  public loadingPopup: LoadingPopup;

  constructor(private readonly controller: Controller) {
    this.authorization = new Authorization(this.controller);
    this.dictionary = new Dictionary(this.controller, this);
    this.audioChallenge = new AudioChallengeView(this.controller, this);
    this.MinigamesPage = new MinigamesPageView(this.controller, this);
    this.loadingPopup = new LoadingPopup(this.controller);
    this.navigation = new Navigation(this.controller, this);
  }

  public initRender() {
    // this.dictionary.draw();
    // this.controller.audioChallengeController.initAudioChallengeGame();
    // this.MinigamesPage.renderMinigamesPage();
    // this.authorization.draw();
  }

  public changeAppTitle(title: string): void {
    (getElement('app-title') as HTMLTitleElement).textContent = title;
  }
}

export default View;
