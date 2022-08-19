import { createElement, getElement } from '../../utils/utils';
import Controller from '../../controller/controller';
import View from '../view';
import settings from '../../settings';
import './audioChallengeView.scss';

class AudioChallengeView {
  private mainWindow: HTMLElement;

  constructor(private readonly controller: Controller, private readonly view: View) {
    this.mainWindow = getElement('main-window') as HTMLElement;
  }

  public renderAudioChallengeStartPage() {
    let buttonsHTML = '';
    for (let i = 0; i <= settings.MAX_DIFFICULTY_LEVEL; i++) {
      buttonsHTML += `<button class='audio-challenge__difficulty-button audio-challenge__difficulty-button_group-${i} button' type='button' data-group='${i}'>${
        i + 1
      }</button>`;
    }

    this.mainWindow.innerHTML = `
    <div class='audio-challenge'>
    <div class='audio-challenge__main-page'>
      <h2 class='audio-challenge__main-title'>Audio challenge</h2>
      <h3 class='audio-challenge__sub-title'>Select difficulty Level</h3>
      <div class='audio-challenge__difficulty-buttons'>
        ${buttonsHTML}
      </div>
      <button class='audio-challenge__back-to-games-button button' type='button'>Back to Games</button>
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
}

export default AudioChallengeView;
