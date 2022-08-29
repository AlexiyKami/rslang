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
    let words;

    if (!this.controller.isAuthorized()) {
      words = await this.controller.api.getWords(group, page);
    } else {
      const allWordsResponse = await this.controller.api.getAllUserAggregatedWords(
        this.controller.authorizationController.userId as string,
        this.controller.authorizationController.token as string,
        undefined,
        undefined,
        group,
        (page + 1) * settings.WORDS_PER_PAGE
      );

      if (typeof allWordsResponse.data !== 'string') {
        const allWords = allWordsResponse.data.paginatedResults;
        const filteredWords = allWords.filter((word) => !word.userWord?.optional?.isLearned);
        words =
          filteredWords.length > settings.WORDS_PER_PAGE
            ? filteredWords.slice(filteredWords.length - settings.WORDS_PER_PAGE)
            : filteredWords;
      } else {
        words = allWordsResponse.data;
      }
    }

    if (typeof words !== 'string' && words.length < 4) {
      this.initGame();
      this.model.audioChallengeModel.onWordsLoadError('The game can be started with words coun more then three!');
    } else if (typeof words === 'string') {
      this.initGame();
    } else {
      this.model.audioChallengeModel.onWordsLoad(words);
    }
  }

  public keyboardHandler(e: KeyboardEvent) {
    if (Object.keys(AudioChallengeKeycodesToHandle).includes(e.code)) {
      const button = getElement(`audio-challenge-group-${e.code}`);
      if (button) button.click();
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
    this.controller.playStopAudio('', false);
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
