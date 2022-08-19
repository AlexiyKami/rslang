import AppModel from '../app';
import { Word } from '../../types/types';
import View from '../../view/view';

class AudioChallengeModel {
  private state: { currentWords: Word[]; currentWordNumber: number };

  constructor(private readonly view: View, private readonly model: AppModel) {
    this.state = {
      currentWords: [],
      currentWordNumber: 0,
    };
  }

  private resetState(): void {
    this.state.currentWordNumber = 0;
    this.state.currentWords = [];
  }

  onWordsLoadError(errorMessage: string) {
    this.resetState();
    this.view.audioChallenge.renderOnWordsLoadErrorMessage(errorMessage);
  }
}

export default AudioChallengeModel;
