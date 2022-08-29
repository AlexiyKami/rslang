import { GameStatistic, StatisticsOptional } from '../../types/types';
import Controller from '../../controller/controller';
import View from '../view';
import './statisticsPage.scss';
import Chart from 'chart.js/auto';
import settings from '../../settings';
import { StatisticsData } from '../../types/types';

class StatisticsPage {
  controller: Controller;
  view: View;
  constructor(controller: Controller, view: View) {
    this.controller = controller;
    this.view = view;
  }
  async draw(): Promise<void> {
    this.controller.showLoadingPopup();
    this.view.changeAppTitle('Statistics');
    const state = this.controller.getState();
    const isAuthorized = this.controller.isAuthorized();
    let statistics: string | StatisticsData | undefined = undefined;
    let audioChallengeStatistics: GameStatistic | undefined = undefined;
    if (isAuthorized) {
      statistics = (await this.controller.api.getStatistics(state.userId as string, state.token as string))
        .data as StatisticsData;
      audioChallengeStatistics = ((statistics as StatisticsData).optional as StatisticsOptional)
        .audioChallengeStatistics as GameStatistic;
    }
    (document.querySelector('.main-window') as HTMLElement).innerHTML = `
      ${
        !isAuthorized
          ? `<div class='darkened-background'>
              <h2>Прежде, чем посмотреть статистику, авторизуйтесь</h2>
            </div>`
          : ''
      }
      <div class='statistics-page'>
        <div class='today-statistics'>
          <h3 class='statistics-title'>Сегодня</h3>
          <div class='today-indicators'>
            <div class='learned-words'>
              <h3 class='learned-words-title'>Слов изучено</h3>
              <h3 class='learned-words-counter'>${statistics?.learnedWords || 0}</h3>
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
                  <span>${
                    (audioChallengeStatistics as GameStatistic)?.rightWords +
                      (audioChallengeStatistics as GameStatistic)?.wrongWords || 0
                  }</span>
                </div>
                <div class='audio-challenge-accuracy'>
                  <span>Точность</span>
                  <span>${
                    (+(
                      (audioChallengeStatistics as GameStatistic)?.rightWords /
                      ((audioChallengeStatistics as GameStatistic)?.rightWords +
                        (audioChallengeStatistics as GameStatistic)?.wrongWords)
                    ).toFixed(2) as number) * 100 || 0
                  }%</span>
                </div>
                <div class='audio-challenge-in-row'>
                  <span>Угадано подряд</span>
                  <span>${(audioChallengeStatistics as GameStatistic)?.maxInRow || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        ${
          isAuthorized
            ? `
          <div class='alltime-statistics'>
            <h3 class='statistics-title'>Все время</h3>
            <div class='alltime-statistics-charts'>
              <div class='alltime-words'>
                <canvas id='chart-words' width='400' height='300'></canvas>
              </div>
              <div class='alltime-progress'>
                <canvas id='chart-progress' width='400' height='300'></canvas>
              </div>
            </div>
          </div>
          `
            : ''
        }
      </div>
    `;
    if (isAuthorized) {
      const words = await this.controller.api.getAllUserAggregatedWords(
        state.userId as string,
        state.token as string,
        `{"$nor":[{ "userWord": null}]}`,
        undefined,
        undefined,
        settings.COUNT_OF_WORDS()
      );

      const wordsChart = document.getElementById('chart-words') as HTMLCanvasElement;
      const progressChart = document.getElementById('chart-progress') as HTMLCanvasElement;
      new Chart(wordsChart, {
        type: 'line',
        data: {
          labels: ['22.08.2022', '23.08.2022', '24.08.2022', '25.08.2022', '26.08.2022', '27.08.2022'], //  labels[] and data[] has same length, labels starts with earliest Date
          datasets: [
            {
              label: 'Слова',
              data: [1, 25, 8, 2, 0, 15],
              backgroundColor: 'orange',
              borderColor: 'lightcoral',
              borderWidth: 2,
            },
          ],
        },
        options: {
          elements: {
            line: {
              tension: 0.3,
            },
          },
          scales: {
            xAxes: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                font: {
                  size: 20,
                },
              },
              onClick: () => {},
            },
          },
        },
      });
      new Chart(progressChart, {
        type: 'line',
        data: {
          labels: ['22.08.2022', '23.08.2022', '24.08.2022', '25.08.2022', '26.08.2022', '27.08.2022'],
          datasets: [
            {
              label: 'Прогресс',
              data: [1, 2, 5, 3, 8, 2],
              backgroundColor: 'green',
              borderColor: 'lightgreen',
              borderWidth: 2,
            },
          ],
        },
        options: {
          elements: {
            line: {
              tension: 0.3,
            },
          },
          scales: {
            xAxes: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                font: {
                  size: 20,
                },
              },
              onClick: () => {},
            },
          },
        },
      });
    }
    this.controller.hideLoadingPopup();
  }
}

export default StatisticsPage;
