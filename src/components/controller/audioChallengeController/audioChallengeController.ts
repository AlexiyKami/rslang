import Controller from '../controller';
import AppModel from '../../app/app';
import { getElement, getRandomNumber } from '../../utils/utils';
import settings from '../../settings';

class AudioChallengeController {
  constructor(private readonly controller: Controller, private readonly model: AppModel) {}

  async startPageHandler(e: Event) {
    // TODO implement
    console.log(e.target);
    console.log(this);
    console.log(this.controller);
    const target = e.target as HTMLElement;
    if (target.classList.contains('audio-challenge__difficulty-button')) {
      const group = +(target.dataset.group || 0);
      const page = getRandomNumber(0, settings.MAX_DICTIONARY_PAGES);
      const words = await this.controller.api.getWords(group, page);
      console.log(typeof words, 'WORDS:', words);
      if (typeof words === 'string') {
        console.log(this);
        this.model.audioChallengeModel.onWordsLoadError(words);
      } else {
        this.model.audioChallengeModel.onWordsLoad(words);
      }
    }
  }

  audioChallengeGamePageWordsHandler(e: Event) {
    const audioChallengeModel = this.model.audioChallengeModel;
    const audioChallengeModelState = audioChallengeModel.state;
    if ((e.target as HTMLElement).classList.contains('audio-challenge__select-button')) {
      const button = e.target as HTMLButtonElement;
      const selectedWord = button.dataset.word || 'none';
      const currentWord = audioChallengeModelState.currentWords[audioChallengeModelState.currentWordIndex];
      const isRightAnswer = selectedWord === currentWord.word;
      audioChallengeModel.onWordSelected(currentWord, isRightAnswer);
    }
  }

  audioChallengeGamePageNextButtonHandler() {
    const nextButton = getElement('audio-challenge__submit-button') as HTMLButtonElement;
    const nextButtonText = nextButton.textContent;
    this.model.audioChallengeModel.onNextButtonClick(nextButtonText);
  }
}

export default AudioChallengeController;
