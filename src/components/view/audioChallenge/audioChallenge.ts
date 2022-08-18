import { getElement } from '../../utils/utils';
import Controller from '../../controller/controller';

class AudioChallenge {
  private mainWindow: HTMLElement | null;

  constructor(private readonly controller: Controller) {
    this.mainWindow = getElement('main-window');
  }
}

export default AudioChallenge;
