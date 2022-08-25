import { createElement, getElement } from '../../utils/utils';
import Controller from '../../controller/controller';
import View from '../view';
import settings from '../../settings';
import './audioChallengeView.scss';
import { AudioChallengeModelState, Word } from '../../types/types';

class AudioChallengeView {
  private mainWindow: HTMLElement;

  constructor(private readonly controller: Controller, private readonly view: View) {
    this.mainWindow = getElement('main-window') as HTMLElement;
  }

  public renderStartPage() {
    this.view.changeAppTitle('Audio Challenge');

    let buttonsHTML = '';
    for (let i = 0; i <= settings.MAX_DIFFICULTY_LEVEL; i++) {
      buttonsHTML += `<button class="audio-challenge__difficulty-button group-${i + 1} audio-challenge-group-Digit${
        i + 1
      } round-button" type="button" data-group="${i}">${i + 1}</button>`;
    }

    this.mainWindow.innerHTML = `
    <div class="audio-challenge">
    <div class="audio-challenge__main-page">
      <h2 class="audio-challenge__main-title">Audio challenge</h2>
      <h3 class="audio-challenge__sub-title">Select difficulty Level</h3>
      <div class="audio-challenge__difficulty-buttons">
        ${buttonsHTML}
      </div>
      <button class="audio-challenge__back-to-games-button audio-challenge-group-Space flat-button" type="button"><span class="space-icon"></span>  Back to Games</button>
    </div>
  </div>
    `;

    const buttonsBlock = getElement('audio-challenge__difficulty-buttons') as HTMLElement;
    buttonsBlock.addEventListener('click', (e) => {
      this.view.loadingPopup.draw();
      this.controller.audioChallengeController.startPageHandler(e);
    });

    (getElement('audio-challenge__back-to-games-button') as HTMLButtonElement).addEventListener('click', () => {
      document.removeEventListener('keyup', this.controller.audioChallengeController.keyboardHandler);
      this.view.MinigamesPage.renderMinigamesPage();
    });

    document.addEventListener('keyup', this.controller.audioChallengeController.keyboardHandler);
  }

  private removeOnWordsLoadErrorMessage(): void {
    const errorMessageBlock = getElement('audio-challenge__error-message');
    if (errorMessageBlock) errorMessageBlock.remove();
  }

  public renderOnWordsLoadErrorMessage(errorMessage: string): void {
    this.view.loadingPopup.clear();
    this.removeOnWordsLoadErrorMessage();
    const audioChallengeBlock = getElement('audio-challenge__main-page');
    const errorMessageBlock = createElement('p', 'audio-challenge__error-message');
    errorMessageBlock.innerHTML = `${errorMessage}<br>Please try again`;
    if (audioChallengeBlock) audioChallengeBlock.append(errorMessageBlock);
  }

  public renderGamePage(state: AudioChallengeModelState) {
    this.view.loadingPopup.clear();
    const currentWord = state.currentWords[state.currentWordIndex];
    let buttonsHTML = '';
    for (let i = 0; i < state.currentGuessingWords.length; i++) {
      buttonsHTML += `<button class="audio-challenge__select-button group-${i + 1} audio-challenge-group-Digit${
        i + 1
      } flat-button" type="button" data-word=${state.currentGuessingWords[i].word}>${i + 1}. ${
        state.currentGuessingWords[i].word
      }</button>`;
    }

    this.mainWindow.innerHTML = `
    <div class="audio-challenge">
    <div class="audio-challenge__game-page">
      <h2 class="audio-challenge__progress">Progress: <span class="audio-challenge__progress-count">${
        state.currentWordIndex + 1
      }</span> / <span
        class="audio-challenge__progress-max">${state.currentWords.length}</span></h2>
      <div class="audio-challenge__word-image-block">
        <img class="audio-challenge__word-image" src="${settings.DATABASE_URL}/${currentWord.image}" alt="Word image">
      </div>
      <p class="audio-challenge__word">&#10004;</p>
      <button class="audio-challenge__play-button button" type="button"></button>
      <div class="audio-challenge__select-buttons-block">
        ${buttonsHTML}
      </div>
      <button class="audio-challenge__submit-button audio-challenge-group-Space flat-button" type="button">
      <span class="space-icon"></span>  I don't know</button>
    </div>
  </div>
    `;

    (getElement('audio-challenge__play-button') as HTMLButtonElement).addEventListener('click', () =>
      this.controller.playStopAudio(state.currentWords[state.currentWordIndex].audio)
    );
    (getElement('audio-challenge__select-buttons-block') as HTMLElement).addEventListener('click', (e) =>
      this.controller.audioChallengeController.gamePageWordsHandler(e)
    );

    (getElement('audio-challenge__submit-button') as HTMLButtonElement).addEventListener('click', () =>
      this.controller.audioChallengeController.gamePageNextButtonHandler()
    );

    this.controller.playStopAudio(currentWord.audio);
  }

  private disableEnableWordsButtons(disable = true) {
    const buttons = document.querySelectorAll('.audio-challenge__select-button');
    buttons.forEach((button) => ((button as HTMLButtonElement).disabled = disable));
  }

  public updatePageOnWordSelect(state: AudioChallengeModelState, isRightAnswer: boolean) {
    this.disableEnableWordsButtons();
    const currentWord = state.currentWords[state.currentWordIndex];
    const wordPrefix = isRightAnswer ? `&#10004;` : `&#10008;`;
    const wordHTML = getElement('audio-challenge__word') as HTMLElement;
    wordHTML.innerHTML = `${wordPrefix}  ${currentWord.word} - ${currentWord.wordTranslate}`;
    wordHTML.style.color = isRightAnswer ? `#008000` : `#ff0000`;
    wordHTML.style.transition = '0.3s';
    wordHTML.style.opacity = '1';

    const img = getElement('audio-challenge__word-image') as HTMLElement;
    img.style.transition = '0.3s';
    img.style.opacity = '1';

    (getElement('audio-challenge__submit-button') as HTMLButtonElement).innerHTML =
      state.currentWordIndex < state.currentWords.length - 1
        ? `<span class="space-icon"></span>Next word`
        : `<span class="space-icon"></span> Show results`;
  }

  public updateGamePage(state: AudioChallengeModelState) {
    const currentWord = state.currentWords[state.currentWordIndex];
    (getElement('audio-challenge__progress-count') as HTMLElement).innerHTML = `${state.currentWordIndex + 1}`;

    const img = getElement('audio-challenge__word-image') as HTMLImageElement;
    img.removeAttribute('style');
    img.src = `${settings.DATABASE_URL}/${currentWord.image}`;

    const wordText = getElement('audio-challenge__word') as HTMLElement;
    wordText.innerHTML = `&#10004;  ${currentWord.word}`;
    wordText.removeAttribute('style');

    const buttons = document.querySelectorAll('.audio-challenge__select-button');
    buttons.forEach((button, i) => {
      const btn = button as HTMLButtonElement;
      btn.innerHTML = `${i + 1}. ${state.currentGuessingWords[i].word}`;
      btn.dataset.word = state.currentGuessingWords[i].word;
      btn.disabled = false;
    });

    (
      getElement('audio-challenge__submit-button') as HTMLButtonElement
    ).innerHTML = `<span class="space-icon"></span> I don't know`;

    this.controller.playStopAudio(currentWord.audio);
  }

  private generateResultsAudioBlock(words: Word[]): string {
    let audioBlock = '';
    words.forEach((word) => {
      audioBlock += `
      <div class="audio-challenge__results-audio">
            <button class="audio-challenge__play-button button" type="button" data-audiolink=${word.audio}></button>
            <p class="audio-challenge__results-word">${word.word} - ${word.wordTranslate}</p>
          </div>
      `;
    });
    return audioBlock;
  }

  public renderResultsPage(state: AudioChallengeModelState) {
    this.mainWindow.innerHTML = `
    <div class="audio-challenge">
      <h2 class="audio-challenge__results-title">Game results</h2>

      <div class="audio-challenge__results-page">
        <div class="audio-challenge__results-block">
          <div class="audio-challenge__results-string">
            <p class="audio-challenge__results-word">Words were repeated:</p>
            <p class="audio-challenge__results-value value-1">${state.rightWords.length + state.wrongWords.length}</p>
          </div>
          <div class="audio-challenge__results-string">
            <p class="audio-challenge__results-word">Right answers:</p>
            <p class="audio-challenge__results-value value-2">${state.rightWords.length}</p>
          </div>
          <div class="audio-challenge__results-string">
            <p class="audio-challenge__results-word">Wrong answers:</p>
            <p class="audio-challenge__results-value value-3">${state.wrongWords.length}</p>
          </div>
          <div class="audio-challenge__results-string">
            <p class="audio-challenge__results-word">Right answers in a row:</p>
            <p class="audio-challenge__results-value value-4">${state.maxRightWordsInRow}</p>
          </div>
        </div>

        <p class="audio-challenge__results-accuracy">Accuracy:</p>
        <p class="audio-challenge__results-accuracy-value">${
          Math.round((state.rightWords.length * 100) / (state.rightWords.length + state.wrongWords.length)) || 0
        }%</p>
        
        <div class="line"></div>

        <p class="audio-challenge__results-right-answers green">Right answers:</p>
        <div class="audio-challenge__results-audio-block">
          ${this.generateResultsAudioBlock(state.rightWords)}
        </div>

        <div class="line"></div>

        <p class="audio-challenge__results-wrong-answers red">Wrong answers:</p>
        <div class="audio-challenge__results-audio-block">
          ${this.generateResultsAudioBlock(state.wrongWords)}
        </div>
        
        </div>
      <div class="audio-challenge__results-buttons-block">
          <button class="audio-challenge__results-button-play audio-challenge-group-Enter flat-button" type="button"><span class="enter-icon"></span> Play again</button>
          <button class="audio-challenge__results-button-back audio-challenge-group-Space flat-button" type="button"><span class="space-icon"></span> Back to games</button>
      </div>
    </div>
    `;

    (getElement('audio-challenge__results-page') as HTMLElement).addEventListener('click', (e) =>
      this.controller.audioChallengeController.gameResultsHandler(e)
    );

    (getElement('audio-challenge__results-button-play') as HTMLButtonElement).addEventListener('click', () =>
      this.controller.audioChallengeController.initGame()
    );

    (getElement('audio-challenge__results-button-back') as HTMLButtonElement).addEventListener('click', () => {
      document.removeEventListener('keyup', this.controller.audioChallengeController.keyboardHandler);
      this.view.MinigamesPage.renderMinigamesPage();
    });
  }
}

export default AudioChallengeView;
