import Controller from '../controller/controller';
import Dictionary from './dictionary/dictionary';
import Navigation from './navigation/navigation';
import Authorization from './authorization/authorization';
import AudioChallengeView from './audioChallenge/audioChallengeView';
import MinigamesPageView from './minigamesPage/minigamesPageView';
import { getElement } from '../utils/utils';

class View {
  public dictionary: Dictionary;
  public audioChallenge: AudioChallengeView;
  private navigation: Navigation;
  public authorization: Authorization;
  public MinigamesPage: MinigamesPageView;

  constructor(private readonly controller: Controller) {
    this.authorization = new Authorization(this.controller);
    this.dictionary = new Dictionary(this.controller);
    this.audioChallenge = new AudioChallengeView(this.controller, this);
    this.MinigamesPage = new MinigamesPageView(this.controller, this);
    this.navigation = new Navigation(this);
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
