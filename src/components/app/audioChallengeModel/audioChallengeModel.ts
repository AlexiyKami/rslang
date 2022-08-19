import AppModel from '../app';
import { Word } from '../../types/types';
import View from '../../view/view';

class AudioChallengeModel {
  private state: {
    currentWords: Word[];
    currentWordNumber: number;
    rightWords: string[];
    wrongWords: string[];
  };

  constructor(private readonly view: View, private readonly model: AppModel) {
    this.state = {
      currentWords: [],
      currentWordNumber: 0,
      rightWords: [],
      wrongWords: [],
    };
  }

  private resetState(): void {
    this.state.currentWordNumber = 0;
    this.state.currentWords.length = 0;
    this.state.rightWords.length = 0;
    this.state.wrongWords.length = 0;
  }

  onWordsLoadError(errorMessage: string) {
    this.resetState();
    this.view.audioChallenge.renderOnWordsLoadErrorMessage(errorMessage);
  }
}

export default AudioChallengeModel;
