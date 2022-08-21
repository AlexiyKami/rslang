import { createElement, getElement, playStopAudio } from '../../utils/utils';
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
    let buttonsHTML = '';
    for (let i = 0; i <= settings.MAX_DIFFICULTY_LEVEL; i++) {
      buttonsHTML += `<button class="audio-challenge__difficulty-button audio-challenge__difficulty-button_group-${i} button" type="button" data-group="${i}">${
        i + 1
      }</button>`;
    }

    this.mainWindow.innerHTML = `
    <div class="audio-challenge">
    <div class="audio-challenge__main-page">
      <h2 class="audio-challenge__main-title">Audio challenge</h2>
      <h3 class="audio-challenge__sub-title">Select difficulty Level</h3>
      <div class="audio-challenge__difficulty-buttons">
        ${buttonsHTML}
      </div>
      <button class="audio-challenge__back-to-games-button button" type="button">Back to Games</button>
    </div>
  </div>
    `;

    const buttonsBlock = getElement('audio-challenge__difficulty-buttons') as HTMLElement;
    buttonsBlock.addEventListener('click', (e) => this.controller.audioChallengeController.startPageHandler(e));
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
      buttonsHTML += `<button class="audio-challenge__select-button button" type="button">${state.currentGuessingWords[i].word}</button>`;
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
      <p class="audio-challenge__word">${currentWord.word}</p>
      <button class="audio-challenge__play-button button" type="button">Play</button>
      <div class="audio-challenge__select-buttons-block">
        ${buttonsHTML}
      </div>
      <button class="audio-challenge__submit-button button" type="button">NEXT WORD</button>
    </div>
  </div>
    `;

    playStopAudio(currentWord.audio);
  }
}

export default AudioChallengeView;
