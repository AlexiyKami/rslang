import Controller from '../../controller/controller';
import View from '../view';
import settings from '../../settings';
import './sprint.scss';
import './timer.scss';
import { Word } from '../../types/types';

export default class Sprint {
  private mainWindow: HTMLElement;
  private readonly FULL_DASH_ARRAY = 283;
  private readonly TIME_LIMIT = 60;
  private readonly START_DELAY = 3;
  private timeLeft = this.TIME_LIMIT + this.START_DELAY;
  private timePassed = 0;
  private timerInterval = 0;

  constructor(private readonly controller: Controller, private readonly view: View) {
    this.mainWindow = document.querySelector('.main-window') as HTMLElement;
  }

  public renderStartPage(withMistake = false): void {
    this.view.changeAppTitle('Sprint');

    let buttonsHTML = '';
    for (let i = 0; i <= settings.MAX_DIFFICULTY_LEVEL; i++) {
      buttonsHTML += `<button class="sprint__difficulty-button group-${i + 1} sprint-group-Digit${
        i + 1
      } round-button" data-group="${i + 1}">${i + 1}</button>`;
    }

    this.mainWindow.innerHTML = `
    <div class="sprint">
      <div class="sprint__main-page">
        <h2 class="sprint__main-title">Sprint</h2>
        <h3 class="sprint__sub-title">Select difficulty Level</h3>
        <div class="sprint__difficulty-buttons">
          ${buttonsHTML}
        </div>
        <button class="sprint__back-to-games-button flat-button sprint-group-Space" type="button"><span class="space-icon"></span>Back to Games</button>
        ${withMistake ? '<span class="sprint-err">Not enough words to start the game!<br>Please try again</span>' : ''}
      </div>
    </div>
    `;

    (document.querySelector('.sprint__difficulty-buttons') as HTMLElement).addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON') this.controller.sprintController.initGame(+target.innerText - 1);
    });

    (document.querySelector('.sprint__back-to-games-button') as HTMLButtonElement).addEventListener('click', () =>
      this.view.MinigamesPage.renderMinigamesPage()
    );

    document.addEventListener('keyup', this.controller.sprintController.keyboardHandler);
  }
  // section: number, page?: number
  public renderSprintGame(): void {
    this.mainWindow.innerHTML = `
    <div class="sprint">
      <div id="sprint-game" class="sprint-game sprint-delay">
        <div id="sprint-audio-btn" class="sprint-audio-btn ${
          this.controller.sprintController.audio ? '' : 'mute'
        }"></div>
        <p id="sprint-result" class="sprint-result">0</p>
        <p id="sprint-points" class="sprint-points">+10 points per word</p>
        <div class="sprint-series">
          <span id="series-one" class="sprint-series-marker"></span>
          <span id="series-two" class="sprint-series-marker"></span>
          <span id="series-three" class="sprint-series-marker"></span>
        </div>
        <p id="sprint-word" class="sprint-word"></p>
        <p id="sprint-translating" class="sprint-translating"></p>
        <div class="sprint-buttons">
          <button id="sprint-true" class="flat-button green sprint-group-ArrowLeft"><span class="arrow-left-icon"></span>right</button>
          <button id="sprint-false" class="flat-button red sprint-group-ArrowRight">wrong<span class="arrow-right-icon"></span></button>
        </div>
      </div>
      <div id="sprint-circle"></div>
    </div>
    `;

    (document.getElementById('sprint-true') as HTMLElement).addEventListener('click', () => {
      this.controller.sprintController.answer(true);
    });

    (document.getElementById('sprint-false') as HTMLElement).addEventListener('click', () => {
      this.controller.sprintController.answer(false);
    });

    const speaker = document.getElementById('sprint-audio-btn') as HTMLElement;
    speaker.addEventListener('click', () => {
      speaker.classList.toggle('mute');
      this.controller.sprintController.toggleAudio();
    });

    this.renderCircle(this.formatTime(this.START_DELAY));
    this.startSprintTimer();
  }

  private renderCircle(value: string) {
    (document.getElementById('sprint-circle') as HTMLElement).innerHTML = `
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
      <span id="base-timer-label" class="base-timer__label">${value}</span>
    </div>
    `;
  }

  private renderSprintResult() {
    const mistakes = [...this.controller.sprintController.wrongWords];
    const correct = [...this.controller.sprintController.rightWords];
    const rightAnswers = this.controller.sprintController.rightAnswers;
    const wrongAnswers = this.controller.sprintController.wrongAnswers;
    const allAWords = correct.length + mistakes.length;
    const allAnswers = rightAnswers + wrongAnswers;

    this.mainWindow.innerHTML = `
    <div class="sprint">
      <h1 class="sprint-results-header">Game Result</h1>
      <div class="sprint-results">
        <div class="sprint-word-result">
          <p class="answer"><span class="repeated">${allAWords}</span> words were repeated</p>
          <p class="answer"><span class="right">${rightAnswers}</span> right answers</p>
          <p class="answer"><span class="wrong">${wrongAnswers}</span> wrong answers</p>
          <p class="answer"><span class="in-a-row">${this.controller.sprintController.maxInARow}</span> in a row</p>
        </div>
        <div id="sprint-circle"></div>
      </div>
      ${
        allAWords > 0
          ? `<div id="sprint-words-links" class="sprint-words-links"> 
            ${
              mistakes.length > 0
                ? `<p class="sprint-words-links-header wrong">Mistakes</p> ${this.audioWordsHTML(mistakes)}`
                : ''
            }${
              correct.length > 0
                ? ` <p class="sprint-words-links-header right">Correct answers</p> ${this.audioWordsHTML(correct)}`
                : ''
            }
            </div>`
          : ''
      }
      <div class="sprint-buttons">
        <button class="sprint-play-again-btn flat-button blue sprint-group-Space"><span class="space-icon"></span>Play again</button>
        <button class="sprint-back-to-games-btn flat-button green sprint-group-Enter"><span class="enter-icon"></span>Back to games</button>
      </div>
    </div>
    `;

    const accuracy = allAnswers === 0 ? 0 : rightAnswers === 0 ? 0 : Math.round((rightAnswers / allAnswers) * 100);
    this.renderCircle(`${accuracy}%`);

    document
      .getElementById('base-timer-path-remaining')
      ?.setAttribute('stroke-dasharray', `${(accuracy * this.FULL_DASH_ARRAY) / 100} ${this.FULL_DASH_ARRAY}`);

    document.getElementById('sprint-words-links')?.addEventListener('click', (event: Event) => {
      if ((event.target as HTMLElement).classList.contains('sprint-audio-play')) {
        const audioLink = (event.target as HTMLButtonElement).dataset.audio || '';
        this.controller.playStopAudio(audioLink);
      }
    });

    (document.querySelector('.sprint-back-to-games-btn') as HTMLButtonElement).addEventListener('click', () =>
      this.view.MinigamesPage.renderMinigamesPage()
    );

    (document.querySelector('.sprint-play-again-btn') as HTMLButtonElement).addEventListener('click', () =>
      this.controller.sprintController.initGame(
        this.controller.sprintController.group,
        this.controller.sprintController.fromTextBook,
        this.controller.sprintController.fromTextBook ? this.controller.sprintController.page : undefined
      )
    );
  }

  public renderEarlyResult() {
    clearInterval(this.timerInterval);
    this.renderSprintResult();
    this.controller.sprintController.setStatistic();
  }

  private audioWordsHTML(words: Word[]): string {
    let result = '';
    words.forEach((word: Word) => {
      result += `
      <div class="sprint-audio">
        <button class="sprint-audio-play" data-audio=${word.audio}></button>
        <p class="sprint-audio-word">${word.word} – ${word.wordTranslate}</p>
      </div>
      `;
    });
    return result;
  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  private calculateTimeFraction(): number {
    if (this.timeLeft > this.TIME_LIMIT) {
      const rawTimeFraction = (this.timeLeft - this.TIME_LIMIT) / this.START_DELAY;
      return rawTimeFraction - (1 / this.START_DELAY) * (1 - rawTimeFraction);
    } else {
      const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
      return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
    }
  }

  private setCircleDasharray() {
    const circleDasharray = `${(this.calculateTimeFraction() * this.FULL_DASH_ARRAY).toFixed(0)} ${
      this.FULL_DASH_ARRAY
    }`;
    document.getElementById('base-timer-path-remaining')?.setAttribute('stroke-dasharray', circleDasharray);
  }

  private startSprintTimer() {
    document.removeEventListener('keyup', this.controller.sprintController.keyboardHandler);
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
        this.timeLeft = this.TIME_LIMIT + this.START_DELAY - this.timePassed;
        if (this.timeLeft === this.TIME_LIMIT)
          document.addEventListener('keyup', this.controller.sprintController.keyboardHandler);
        if (this.timeLeft > this.TIME_LIMIT)
          (document.getElementById('base-timer-label') as HTMLElement).innerHTML = this.formatTime(
            this.timeLeft - this.TIME_LIMIT
          );
        else (document.getElementById('base-timer-label') as HTMLElement).innerHTML = this.formatTime(this.timeLeft);
        this.setCircleDasharray();
        if (this.timeLeft === this.TIME_LIMIT) {
          (document.getElementById('sprint-game') as HTMLElement).classList.remove('sprint-delay');
        }
        if (this.timeLeft === 0) {
          clearInterval(this.timerInterval);
          this.renderSprintResult();
          this.controller.sprintController.setStatistic();
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
