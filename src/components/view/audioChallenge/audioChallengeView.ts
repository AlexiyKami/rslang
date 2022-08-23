import { createElement, getElement } from '../../utils/utils';
import Controller from '../../controller/controller';
import View from '../view';
import settings from '../../settings';
import './audioChallengeView.scss';
import { AudioChallengeModelState } from '../../types/types';

class AudioChallengeView {
  private mainWindow: HTMLElement;

  constructor(private readonly controller: Controller, private readonly view: View) {
    this.mainWindow = getElement('main-window') as HTMLElement;
  }

  public renderAudioChallengeStartPage() {
    this.view.changeAppTitle('Audio Challenge');

    let buttonsHTML = '';
    for (let i = 0; i <= settings.MAX_DIFFICULTY_LEVEL; i++) {
      buttonsHTML += `<button class="audio-challenge__difficulty-button group-${
        i + 1
      } round-button" type="button" data-group="${i + 1}">${i + 1}</button>`;
    }

    this.mainWindow.innerHTML = `
    <div class="audio-challenge">
    <div class="audio-challenge__main-page">
      <h2 class="audio-challenge__main-title">Audio challenge</h2>
      <h3 class="audio-challenge__sub-title">Select difficulty Level</h3>
      <div class="audio-challenge__difficulty-buttons">
        ${buttonsHTML}
      </div>
      <button class="audio-challenge__back-to-games-button flat-button" type="button">Back to Games</button>
    </div>
  </div>
    `;

    const buttonsBlock = getElement('audio-challenge__difficulty-buttons') as HTMLElement;
    buttonsBlock.addEventListener('click', (e) => this.controller.audioChallengeController.startPageHandler(e));

    (getElement('audio-challenge__back-to-games-button') as HTMLButtonElement).addEventListener('click', () =>
      this.view.MinigamesPage.renderMinigamesPage()
    );
  }

  private removeOnWordsLoadErrorMessage(): void {
    const errorMessageBlock = getElement('audio-challenge__error-message');
    if (errorMessageBlock) errorMessageBlock.remove();
  }

  public renderOnWordsLoadErrorMessage(errorMessage: string): void {
    this.removeOnWordsLoadErrorMessage();
    const audioChallengeBlock = getElement('audio-challenge__main-page');
    const errorMessageBlock = createElement('p', 'audio-challenge__error-message');
    errorMessageBlock.innerHTML = `${errorMessage}<br>Please try again`;
    if (audioChallengeBlock) audioChallengeBlock.append(errorMessageBlock);
  }

  public renderAudioChallengeGamePage(state: AudioChallengeModelState) {
    const currentWord = state.currentWords[state.currentWordIndex];
    let buttonsHTML = '';
    for (let i = 0; i < state.currentGuessingWords.length; i++) {
      buttonsHTML += `<button class="audio-challenge__select-button group-${
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
      <button class="audio-challenge__submit-button flat-button" type="button">I don't know</button>
    </div>
  </div>
    `;

    (getElement('audio-challenge__play-button') as HTMLButtonElement).addEventListener('click', () =>
      this.controller.playStopAudio(state.currentWords[state.currentWordIndex].audio)
    );
    (getElement('audio-challenge__select-buttons-block') as HTMLElement).addEventListener('click', (e) =>
      this.controller.audioChallengeController.audioChallengeGamePageWordsHandler(e)
    );

    (getElement('audio-challenge__submit-button') as HTMLButtonElement).addEventListener('click', () =>
      this.controller.audioChallengeController.audioChallengeGamePageNextButtonHandler()
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
    wordHTML.innerHTML = `${wordPrefix}  ${currentWord.word}`;
    wordHTML.style.color = isRightAnswer ? `#008000` : `#ff0000`;
    wordHTML.style.transition = '0.3s';
    wordHTML.style.opacity = '1';

    const img = getElement('audio-challenge__word-image') as HTMLElement;
    img.style.transition = '0.3s';
    img.style.opacity = '1';

    (getElement('audio-challenge__submit-button') as HTMLButtonElement).textContent =
      state.currentWordIndex < state.currentWords.length - 1 ? 'Next word' : 'Show results';
  }

  public updateAudioChallengeGamePage(state: AudioChallengeModelState) {
    const currentWord = state.currentWords[state.currentWordIndex];
    (getElement('audio-challenge__progress-count') as HTMLElement).textContent = `${state.currentWordIndex + 1}`;

    const img = getElement('audio-challenge__word-image') as HTMLImageElement;
    img.removeAttribute('style');
    img.src = `${settings.DATABASE_URL}/${currentWord.image}`;

    const wordText = getElement('audio-challenge__word') as HTMLElement;
    wordText.innerHTML = `&#10004;  ${currentWord.word}`;
    wordText.removeAttribute('style');

    const buttons = document.querySelectorAll('.audio-challenge__select-button');
    buttons.forEach((button, i) => {
      const btn = button as HTMLButtonElement;
      btn.textContent = `${i + 1}. ${state.currentGuessingWords[i].word}`;
      btn.dataset.word = state.currentGuessingWords[i].word;
      btn.disabled = false;
    });

    (getElement('audio-challenge__submit-button') as HTMLButtonElement).textContent = `I don't know`;

    this.controller.playStopAudio(currentWord.audio);
  }

  public renderAudioChallengeResultsPage(state: AudioChallengeModelState) {
    this.mainWindow.innerHTML = `
    <div class="audio-challenge">
    <div class="audio-challenge__results-page">
      <h2 class="audio-challenge__results-title">Game results</h2>
      <p>Words were repeated: ${state.rightWords.length + state.wrongWords.length}</p>
      <p>Right answers: ${state.rightWords.length}</p>
      <p>Wrong answers: ${state.wrongWords.length}</p>
      <p>Right answers in a row: ${state.maxRightWordsInRow}</p>
      <p>Accuracy: ${
        Math.round((state.rightWords.length * 100) / (state.rightWords.length + state.wrongWords.length)) || 0
      }%</p>
      <div class="audio-challenge__results-buttons-block">
        <button class="audio-challenge__results-button button" type="button">Play again</button>
        <button class="audio-challenge__results-button button" type="button">Back to games</button>
      </div>
    </div>
  </div>
    `;

    (getElement('audio-challenge__results-button') as HTMLButtonElement).addEventListener('click', () =>
      this.controller.audioChallengeController.initAudioChallengeGame()
    );
  }
}

export default AudioChallengeView;
