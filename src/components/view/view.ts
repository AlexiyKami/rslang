import Controller from '../controller/controller';
import Dictionary from './dictionary/dictionary';
import Navigation from './navigation/navigation';
import AudioChallenge from './audioChallenge/audioChallenge';

class View {
  private controller: Controller;

  private dictionary: Dictionary;

  private audioChallenge: AudioChallenge;

  private navigation: Navigation;

  constructor(controller: Controller) {
    this.controller = controller;
    this.navigation = new Navigation();
    this.dictionary = new Dictionary(this.controller);
    this.audioChallenge = new AudioChallenge(this.controller);
  }

  public initRender() {
    this.dictionary.draw();
  }
}

export default View;
