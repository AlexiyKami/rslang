import Controller from '../../controller/controller';
import View from '../view';
import './statisticsPage.scss';

class StatisticsPage {
  controller: Controller;
  view: View;
  constructor(controller: Controller, view: View) {
    this.controller = controller;
    this.view = view;
  }
  draw(): void {
    this.view.changeAppTitle('Statistics');
    (document.querySelector('.main-window') as HTMLElement).innerHTML = `
      <div class='statistics-page'>
        <div class='today-statistics'>
          <h3 class='statistics-title'>Сегодня</h3>
          <div class='today-indicators'>
            <div class='learned-words'>
              <h3 class='learned-words-title'>Слов изучено</h3>
              <h3 class='learned-words-counter'>3600</h3>
            </div>
            <div class='accuracy'>
              <h3 class='accuracy-title'>Точность</h3>
              <h3 class='accuracy-counter'>0%</h3>
            </div>
            <div class='sprint-indicator'>
              <h3 class='sprint-indicator-title'>Спринт</h3>
              <div class='indicator-stats'>
                <div class='sprint-words'>
                  <span>Слов</span>
                  <span>0</span>
                </div>
                <div class='sprint-accuracy'>
                  <span>Точность</span>
                  <span>0%</span>
                </div>
                <div class='sprint-in-row'>
                  <span>Угадано подряд</span>
                  <span>0</span>
                </div>
              </div>
            </div>
            <div class='audio-challenge-indicator'>
              <h3 class='audio-challenge-indicator-title'>Аудиовызов</h3>
              <div class='indicator-stats'>
                <div class='audio-challenge-words'>
                  <span>Слов</span>
                  <span>0</span>
                </div>
                <div class='audio-challenge-accuracy'>
                  <span>Точность</span>
                  <span>0%</span>
                </div>
                <div class='audio-challenge-in-row'>
                  <span>Угадано подряд</span>
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='alltime-statistics'>
          
        </div>
      </div>
    `;
  }
}

export default StatisticsPage;
