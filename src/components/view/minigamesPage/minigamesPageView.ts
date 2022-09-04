import './minigamesPage.scss';
import { getElement } from '../../utils/utils';
import './../../../assets/images/sprint.png';
import './../../../assets/images/audioChallenge.png';
import Controller from '../../controller/controller';
import View from '../view';

class MinigamesPageView {
  private mainWindow: HTMLElement;

  constructor(private readonly controller: Controller, private readonly view: View) {
    this.mainWindow = getElement('main-window') as HTMLElement;
  }

  public renderMinigamesPage(): void {
    this.view.changeAppTitle('Games');
    this.view.hideFooter(false);

    this.mainWindow.innerHTML = `
    <div class="minigames-page">
      <div class="minigames-page__games-block">
        <div class="minigames-page__game-card">
          <img class="minigames-page__game-card-img" src="./assets/images/sprint.png"
               alt="Audio Challenge game">
          <h2 class="minigames-page__game-card-title">Sprint</h2>
          <p class="minigames-page__game-card-text">Check how much points you can get in one minute, making educated
            guesses about what is right and what is wrong.</p>
          <button class="minigames-page__game-card-button minigames-page__game-card-button_sprint flat-button" type="button">Play</button>
        </div>
        <div class="minigames-page__game-card">
          <img class="minigames-page__game-card-img" src="./assets/images/audioChallenge.png"
               alt="Audio Challenge game">
          <h2 class="minigames-page__game-card-title">Audio challenge</h2>
          <p class="minigames-page__game-card-text">Check your listening skills, trying to pick the right meaning after
            hearing a word. Be careful, as you just have one guess.</p>
          <button class="minigames-page__game-card-button minigames-page__game-card-button_audiochallenge flat-button" type="button">Play</button>
        </div>
      </div>
    </div>
    `;

    (getElement('minigames-page__game-card-button_audiochallenge') as HTMLButtonElement).addEventListener('click', () =>
      this.controller.audioChallengeController.initGame()
    );

    (getElement('minigames-page__game-card-button_sprint') as HTMLButtonElement).addEventListener('click', () =>
      this.view.sprint.renderStartPage()
    );
  }
}

export default MinigamesPageView;
