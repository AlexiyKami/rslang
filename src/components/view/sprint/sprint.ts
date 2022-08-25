import Controller from '../../controller/controller';
import View from '../view';
import settings from '../../settings';
import './sprint.scss';
// import { Word } from '../../types/types';

export default class Sprint {
  private mainWindow: HTMLElement;

  constructor(private readonly controller: Controller, private readonly view: View) {
    this.mainWindow = document.querySelector('.main-window') as HTMLElement;
  }

  public renderStartPage() {
    this.view.changeAppTitle('Sprint');

    let buttonsHTML = '';
    for (let i = 0; i <= settings.MAX_DIFFICULTY_LEVEL; i++) {
      buttonsHTML += `<button class="sprint__difficulty-button group-${i + 1} round-button" type="button" data-group="${
        i + 1
      }">${i + 1}</button>`;
    }

    this.mainWindow.innerHTML = `
    <div class="sprint">
      <div class="sprint__main-page">
        <h2 class="sprint__main-title">Sprint</h2>
        <h3 class="sprint__sub-title">Select difficulty Level</h3>
        <div class="sprint__difficulty-buttons">
          ${buttonsHTML}
        </div>
        <button class="sprint__back-to-games-button flat-button" type="button">Back to Games</button>
      </div>
    </div>
    `;

    // const buttonsBlock = getElement('sprint__difficulty-buttons') as HTMLElement;
    // buttonsBlock.addEventListener('click', (e) => this.controller.audioChallengeController.startPageHandler(e));

    (document.querySelector('.sprint__back-to-games-button') as HTMLButtonElement).addEventListener('click', () =>
      this.view.MinigamesPage.renderMinigamesPage()
    );
  }
}
