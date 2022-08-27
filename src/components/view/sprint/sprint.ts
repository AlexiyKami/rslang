import Controller from '../../controller/controller';
import View from '../view';
import settings from '../../settings';
import './sprint.scss';
import './timer.scss';
// import { Word } from '../../types/types';

export default class Sprint {
  private mainWindow: HTMLElement;
  private readonly FULL_DASH_ARRAY = 283;
  private readonly TIME_LIMIT = 60;
  private timeLeft = this.TIME_LIMIT;
  private timePassed = 0;
  private timerInterval = 0;

  constructor(private readonly controller: Controller, private readonly view: View) {
    this.mainWindow = document.querySelector('.main-window') as HTMLElement;
  }

  public renderStartPage(): void {
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
      this.controller.sprintController.initGame(0)
    );
  }
  // section: number, page?: number
  public renderSprintGame(): void {
    this.mainWindow.innerHTML = `
    <div class="sprint">
      <div class="sprint-game">
        <p id="sprint-result" class="sprint-result">0</p>
        <p id="sprint-points" class="sprint-points">+10 points per word</p>
        <div class="sprint-series">
          <span id="series-one" class="sprint-series-marker"></span>
          <span id="series-two" class="sprint-series-marker"></span>
          <span id="series-three" class="sprint-series-marker"></span>
        </div>
        <p id="sprint-word" class="sprint-word">dick</p>
        <p id="sprint-translating" class="sprint-translating">хуй</p>
        <div class="sprint-buttons">
          <button id="sprint-true" class="flat-button green">right</button>
          <button id="sprint-false" class="flat-button red">wrong</button>
        </div>
        <div id="timer-app"></div>
      </div>
    </div>
    `;

    (document.getElementById('sprint-true') as HTMLElement).addEventListener('click', () => {
      this.controller.sprintController.answer(true);
    });
    (document.getElementById('sprint-false') as HTMLElement).addEventListener('click', () => {
      this.controller.sprintController.answer(false);
    });

    this.renderTimer();
    this.startTimer();
  }

  private renderTimer() {
    (document.getElementById('timer-app') as HTMLElement).innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${this.formatTime(this.timeLeft)}</span>
    </div>
    `;
  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  private calculateTimeFraction(): number {
    const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
    return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
  }

  private setCircleDasharray() {
    const circleDasharray = `${(this.calculateTimeFraction() * this.FULL_DASH_ARRAY).toFixed(0)} 283`;
    document.getElementById('base-timer-path-remaining')?.setAttribute('stroke-dasharray', circleDasharray);
  }

  private startTimer() {
    clearInterval(this.timerInterval);
    this.timeLeft = this.TIME_LIMIT;
    this.timePassed = 0;
    this.timerInterval = 0;

    this.timerInterval = window.setInterval(() => {
      if (!document.getElementById('base-timer-label')) {
        clearInterval(this.timerInterval);
        this.timeLeft = this.TIME_LIMIT;
        this.timePassed = 0;
        this.timerInterval = 0;
      } else {
        this.timePassed = this.timePassed += 1;
        this.timeLeft = this.TIME_LIMIT - this.timePassed;
        (document.getElementById('base-timer-label') as HTMLElement).innerHTML = this.formatTime(this.timeLeft);
        this.setCircleDasharray();
        if (this.timeLeft === 0) {
          clearInterval(this.timerInterval);
        }
      }
    }, 1000);
  }

  public setWord(word: string) {
    (document.getElementById('sprint-word') as HTMLElement).textContent = word;
  }

  public setTranslate(word: string) {
    (document.getElementById('sprint-translating') as HTMLElement).textContent = word;
  }

  public setResult(result: number) {
    (document.getElementById('sprint-result') as HTMLElement).textContent = `${result}`;
  }

  public setPoints(points: number) {
    (document.getElementById('sprint-points') as HTMLElement).textContent = `+${points} points per word`;
  }

  public setSeries(series: 0 | 1 | 2 | 3) {
    const seriesOne = document.getElementById('series-one') as HTMLElement;
    const seriesTwo = document.getElementById('series-two') as HTMLElement;
    const seriesThree = document.getElementById('series-three') as HTMLElement;

    if (series === 0) {
      seriesOne.classList.remove(`sprint-series-marker--fill`);
      seriesTwo.classList.remove(`sprint-series-marker--fill`);
      seriesThree.classList.remove(`sprint-series-marker--fill`);
    } else if (series === 1) {
      seriesOne.classList.add(`sprint-series-marker--fill`);
      seriesTwo.classList.remove(`sprint-series-marker--fill`);
      seriesThree.classList.remove(`sprint-series-marker--fill`);
    } else if (series === 2) {
      seriesOne.classList.add(`sprint-series-marker--fill`);
      seriesTwo.classList.add(`sprint-series-marker--fill`);
      seriesThree.classList.remove(`sprint-series-marker--fill`);
    } else if (series === 3) {
      seriesOne.classList.add(`sprint-series-marker--fill`);
      seriesTwo.classList.add(`sprint-series-marker--fill`);
      seriesThree.classList.add(`sprint-series-marker--fill`);
    }
  }
}
