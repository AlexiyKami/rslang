import Controller from '../controller/controller';
import Dictionary from './dictionary/dictionary';
import Navigation from './navigation/navigation';
import AudioChallengeView from './audioChallenge/audioChallengeView';

class View {
  private dictionary: Dictionary;
  audioChallenge: AudioChallengeView;
  private navigation: Navigation;

  constructor(private readonly controller: Controller) {
    this.navigation = new Navigation();
    this.dictionary = new Dictionary(this.controller);
    this.audioChallenge = new AudioChallengeView(this.controller, this);
  }

  public initRender() {
    this.dictionary.draw();
    this.controller.audioChallengeController.initAudioChallengeGame();
  }
}

export default View;
