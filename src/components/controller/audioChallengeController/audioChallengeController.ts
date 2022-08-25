import Controller from '../controller';
import AppModel from '../../app/app';
import { getElement, getRandomNumber } from '../../utils/utils';
import settings from '../../settings';
import { AudioChallengeKeycodesToHandle } from '../../types/types';

class AudioChallengeController {
  constructor(private readonly controller: Controller, private readonly model: AppModel) {}

  public initGame() {
    this.model.audioChallengeModel.initGame();
  }

  public async initGameByGroupPage(group: number, page: number) {
    const words = await this.controller.api.getWords(group, page);
    if (typeof words === 'string') {
      this.initGame();
    } else {
      this.model.audioChallengeModel.onWordsLoad(words);
    }
  }

  public keyboardHandler(e: KeyboardEvent) {
    if (Object.keys(AudioChallengeKeycodesToHandle).includes(e.code)) {
      const button = getElement(`audio-challenge-group-${e.code}`);
      // const answerButton = getElement(`audio-challenge__select-button.group-${e.code}`);
      console.log(e.code, button);
      if (button) button.click();
      // if (answerButton) answerButton.click();
    }
  }

  public async startPageHandler(e: Event) {
    const buttons = document.querySelectorAll('.audio-challenge__difficulty-button');
    buttons.forEach((button) => ((button as HTMLButtonElement).disabled = true));
    const target = e.target as HTMLElement;
    if (target.classList.contains('audio-challenge__difficulty-button')) {
      const group = +(target.dataset.group || 0);
      const page = getRandomNumber(0, settings.MAX_DICTIONARY_PAGES);
      const words = await this.controller.api.getWords(group, page);
      if (typeof words === 'string') {
        this.model.audioChallengeModel.onWordsLoadError(words);
        buttons.forEach((button) => ((button as HTMLButtonElement).disabled = false));
      } else {
        this.model.audioChallengeModel.onWordsLoad(words);
      }
    }
  }

  public gamePageWordsHandler(e: Event) {
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

  public gamePageNextButtonHandler() {
    const state = this.model.audioChallengeModel.state;
    const nextButton = getElement('audio-challenge__submit-button') as HTMLButtonElement;
    const nextButtonText =
      state.currentWordIndex < state.currentWords.length - 1 ? nextButton.textContent : 'Show results';
    this.model.audioChallengeModel.onNextButtonClick(nextButtonText);
  }

  public gameResultsHandler(e: Event) {
    if ((e.target as HTMLElement).classList.contains('audio-challenge__play-button')) {
      const audioLink = (e.target as HTMLButtonElement).dataset.audiolink || '';
      this.controller.playStopAudio(audioLink);
    }
  }
}

export default AudioChallengeController;
