import Controller from '../controller/controller';
import Dictionary from './dictionary/dictionary';
import Navigation from './navigation/navigation';
import AudioChallengeView from './audioChallenge/audioChallengeView';

class View {
  private controller: Controller;

  private dictionary: Dictionary;

  private audioChallenge: AudioChallengeView;

  private navigation: Navigation;

  constructor(controller: Controller) {
    this.controller = controller;
    this.navigation = new Navigation();
    this.dictionary = new Dictionary(this.controller);
    this.audioChallenge = new AudioChallengeView(this.controller, this);
  }

  public initRender() {
    this.dictionary.draw();
    this.audioChallenge.renderAudioChallengeStartPage();
  }
}

export default View;
