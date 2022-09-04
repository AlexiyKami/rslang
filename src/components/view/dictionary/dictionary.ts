import { AggregatedWord } from '../../types/types';
import settings from '../../settings';
import { Word } from '../../types/types';
import './dictionary.scss';
import DictionaryController from '../../controller/dictionaryController';
import Controller from '../../controller/controller';
import View from '../view';

class Dictionary {
  dictionaryController: DictionaryController;
  baseController: Controller;
  view: View;

  constructor(controller: Controller, view: View) {
    this.baseController = controller;
    this.view = view;
    this.dictionaryController = controller.dictionary;
    this.dictionaryController.onDictionaryUpdate.push(
      this.draw.bind(this),
      this.baseController.playStopAudio.bind(controller, '', false)
    );
  }

  draw(): void {
    this.view.changeAppTitle('Textbook');
    this.view.hideFooter(false);
    const isAuthorized = this.baseController.isAuthorized();
    const groupBtns = new Array(settings.MAX_DIFFICULTY_LEVEL + 2)
      .fill('')
      .map((item, index) => `<button class='round-button group-${index + 1}'>${index + 1}</button>`)
      .join('');
    const pagination = `
    <div class='dictionary-pagination'>
      <button class='rounded-button prev' disabled>Prev</button>
      <h4 class="dictionary-page-number">1</h4>
      <button class='rounded-button next'>Next</button>
    </div>
  `;
    if (this.dictionaryController.getDictionaryGroup() === 6) {
      this.view.changeAppTitle('Dictionary');
    }
    (document.querySelector('.main-window') as HTMLElement).innerHTML = `
    <div class='dictionary'>
      ${pagination}
      <div class='dictionary-groups'>
        <span>Difficulty</span>
        <div class='group-buttons'>
          ${groupBtns}
        </div>
      </div>
      ${
        this.dictionaryController.getDictionaryGroup() !== 6
          ? `
      <div class='dictionary-minigame-links'>
        <div class='sprint-link'>
          <img src="./assets/images/sprint.png" alt="Sprint game">
          <h2>Sprint</h2>
        </div>
        <div class='audio-challenge-link'>
          <img src="./assets/images/audioChallenge.png" alt="Audio Challenge game">
          <h2>Audio challenge</h2>
        </div>
      </div>
      `
          : ''
      }
      <div class='dictionary-words'>
      
      </div>
      ${pagination}
    </div>
    `;
    if (!isAuthorized) {
      document.querySelector('.group-7')?.remove();
    }
    (document.querySelector('.group-buttons') as HTMLElement).childNodes.forEach((elem) => {
      elem.addEventListener('click', () => {
        const group = +(elem.textContent as string) - 1;
        this.dictionaryController.setDictionaryGroup(group);
        if (group === 6) this.baseController.navController.curPage = 2;
        else this.baseController.navController.curPage = 1;
      });
    });

    document
      .querySelectorAll('.dictionary-pagination')
      .forEach((item) => item.addEventListener('click', (e) => this.onPaginationClick(e)));

    if (this.dictionaryController.getDictionaryGroup() !== 6) {
      (document.querySelector('.sprint-link') as HTMLElement).addEventListener('click', () => {
        this.baseController.navController.curPage = 3;
        this.baseController.sprintController.initGame(
          this.dictionaryController.getDictionaryGroup(),
          true,
          this.dictionaryController.getDictionaryPage()
        );
      });
      (document.querySelector('.audio-challenge-link') as HTMLElement).addEventListener('click', () => {
        this.view.loadingPopup.draw();
        this.baseController.navController.curPage = 3;
        this.baseController.audioChallengeController.initGameByGroupPage(
          this.dictionaryController.getDictionaryGroup(),
          this.dictionaryController.getDictionaryPage()
        );
      });
    }
    this.updatePagination();
    this.updateGroupButtons();
    this.updateWords();
  }

  async updateWords(): Promise<void> {
    this.baseController.showLoadingPopup();
    const isAuthorized = this.baseController.isAuthorized();
    const words = await this.dictionaryController.getWords();
    let items;
    if (typeof words === 'string') {
      items = words;
    } else {
      items = words
        .map((word: Word | AggregatedWord) => {
          return `<div class='word-card ${(word as AggregatedWord)?.userWord?.optional?.isLearned ? 'learned' : ''} ${
            (word as AggregatedWord)?.userWord?.difficulty === 'hard' ? 'hard' : ''
          }' data-id=${(word as Word).id ? (word as Word).id : (word as AggregatedWord)._id}>
            <img class='image' src='${settings.DATABASE_URL}/${word.image}' alt="Word image">
            <div class='description'>
              <div class='title'>
                <span class='word'>${word.word.charAt(0).toUpperCase() + word.word.slice(1)}</span>
                <span class='transcription'>${word.transcription}</span>
                <div class='translation'>${word.wordTranslate}</div>
              </div>
              <div class='text-example'>
                <p  class='text'>${word.textExample}</p>
                <p class='translation'>${word.textExampleTranslate}</p>
              </div>
              <div class='text-meaning'>
                <p class='text'>${word.textMeaning}</p>
                <p class='translation'>${word.textMeaningTranslate}</p>
              </div>
              ${
                isAuthorized
                  ? `<div class='buttons'>
                      <button class='add-difficult-button flat-button'>${
                        this.dictionaryController.getDictionaryGroup() !== 6 ? `Difficult` : 'Remove from Difficult'
                      }
                      </button>
                      ${
                        this.dictionaryController.getDictionaryGroup() !== 6
                          ? `<button class='add-learned-button flat-button'></button>`
                          : ''
                      }
                    </div>`
                  : ''
              }
            </div>
            ${
              isAuthorized
                ? `<div class='counters'>
                    <div class='right-answers' title='Right answers'>${
                      (word as AggregatedWord)?.userWord?.optional?.successfulAttempts || '0'
                    }</div>
                    <div class='wrong-answers' title='Wrong answers'>${
                      (word as AggregatedWord)?.userWord?.optional?.failedAttempts || '0'
                    }</div>
                  </div>`
                : ''
            }
            <div
              class='audio-image'
              audio='${word.audio}'
              audio-example='${word.audioExample}'
              audio-meaning='${word.audioMeaning}'
            ></div>
          </div>`;
        })
        .join('');
    }
    document.querySelector('.dictionary-words')?.insertAdjacentHTML('beforeend', items as string);
    document.querySelectorAll('.audio-image').forEach((elem) => {
      elem.addEventListener('click', (e: Event) => {
        const currTarget = e.currentTarget as HTMLElement;
        let audioURL = [
          currTarget.getAttribute('audio'),
          currTarget.getAttribute('audio-example'),
          currTarget.getAttribute('audio-meaning'),
        ];
        if (currTarget.classList.contains('playing')) {
          audioURL = [];
        }
        let current = 0;
        this.audioHandler(currTarget, audioURL[current] as string);
        this.baseController.onAudioEnded(() => {
          current++;
          if (!(current >= audioURL.length)) {
            currTarget.classList.remove('playing');
            this.audioHandler(currTarget, audioURL[current] as string);
          } else {
            currTarget.classList.remove('playing');
          }
        });
      });
    });

    document.querySelectorAll('.word-card').forEach((card) => {
      card.addEventListener('click', async (e: Event) => {
        this.baseController.showLoadingPopup();
        const target = e.target as HTMLElement;
        const currTarget = e.currentTarget as HTMLElement;
        if (target.classList.contains('add-difficult-button')) {
          const id = currTarget.getAttribute('data-id') as string;
          await this.dictionaryController.updateUserWord(id, 'hard');
          currTarget.classList.add('hard');
        }
        if (target.classList.contains('add-learned-button')) {
          const id = currTarget.getAttribute('data-id') as string;
          if (currTarget.classList.contains('learned')) {
            await this.dictionaryController.updateUserWord(id, 'easy');
            currTarget.classList.remove('learned');
          } else {
            await this.dictionaryController.updateUserWord(id, 'learned');
            currTarget.classList.add('learned');
          }
        }
        this.baseController.hideLoadingPopup();
        this.checkForLearnedPage();
      });
    });
    if (isAuthorized) {
      this.checkForLearnedPage();
    }
    if (this.dictionaryController.getDictionaryGroup() === 6) {
      this.updatePagination();
    }
    this.baseController.hideLoadingPopup();
  }

  private checkForLearnedPage(): void {
    if (this.dictionaryController.getDictionaryGroup() !== 6) {
      if (document.querySelectorAll('.word-card.hard, .word-card.learned').length === settings.WORDS_PER_PAGE) {
        (document.querySelector('.dictionary') as HTMLElement)?.classList?.add('learned');
        (document.querySelector('.audio-challenge-link') as HTMLElement).style.pointerEvents = 'none';
        (document.querySelector('.audio-challenge-link') as HTMLElement).style.cursor = 'default';
        (document.querySelector('.sprint-link') as HTMLElement).style.pointerEvents = 'none';
        (document.querySelector('.sprint-link') as HTMLElement).style.cursor = 'default';
        document.querySelectorAll('.dictionary-page-current').forEach((item) => item.classList.add('learned'));
      } else {
        (document.querySelector('.dictionary') as HTMLElement)?.classList?.remove('learned');
        (document.querySelector('.audio-challenge-link') as HTMLElement).style.pointerEvents = 'auto';
        (document.querySelector('.audio-challenge-link') as HTMLElement).style.cursor = 'pointer';
        (document.querySelector('.sprint-link') as HTMLElement).style.pointerEvents = 'auto';
        (document.querySelector('.sprint-link') as HTMLElement).style.cursor = 'pointer';
        document.querySelectorAll('.dictionary-page-current').forEach((item) => item.classList.remove('learned'));
      }
    }
  }

  private audioHandler(currTarget: HTMLElement, audioFile: string): void {
    if (!currTarget.classList.contains('playing')) {
      this.baseController.playStopAudio(audioFile as string);
      document.querySelectorAll('.audio-image.playing').forEach((img) => img.classList.remove('playing'));
      currTarget.classList.add('playing');
    } else {
      this.baseController.playStopAudio('', false);
      currTarget.classList.remove('playing');
    }
  }

  private updateGroupButtons(): void {
    (document.querySelector('.group-buttons') as HTMLElement).childNodes.forEach((elem) => {
      (elem as HTMLButtonElement).disabled =
        +(elem.textContent as string) === this.dictionaryController.getDictionaryGroup() + 1;
    });
  }

  private onPaginationClick(e: Event): void {
    const target = e.target as HTMLElement;
    const page = this.dictionaryController.getDictionaryPage();
    const difficultWordsPage = this.dictionaryController.getDifficultWordsPage();
    if (target.classList.contains('prev')) {
      if (this.dictionaryController.getDictionaryGroup() !== 6) {
        this.dictionaryController.setDictionaryPage(page - 1);
      } else {
        this.dictionaryController.setDifficultWordsPage(difficultWordsPage - 1);
      }
    }
    if (target.classList.contains('next')) {
      if (this.dictionaryController.getDictionaryGroup() !== 6) {
        this.dictionaryController.setDictionaryPage(page + 1);
      } else {
        this.dictionaryController.setDifficultWordsPage(difficultWordsPage + 1);
      }
    }
  }

  private updatePagination(): void {
    const prev = document.querySelectorAll('.dictionary-pagination .prev');
    const next = document.querySelectorAll('.dictionary-pagination .next');
    prev.forEach((item) => ((item as HTMLButtonElement).disabled = false));
    next.forEach((item) => ((item as HTMLButtonElement).disabled = false));
    if (this.dictionaryController.getDictionaryGroup() === 6) {
      if (this.dictionaryController.getDifficultWordsPage() <= 0) {
        prev.forEach((item) => ((item as HTMLButtonElement).disabled = true));
      }
      if (this.dictionaryController.getDifficultWordsPage() === this.dictionaryController.getMaxDifficultWordsPage()) {
        next.forEach((item) => ((item as HTMLButtonElement).disabled = true));
      }
    } else {
      if (this.dictionaryController.getDictionaryPage() <= 0) {
        prev.forEach((item) => ((item as HTMLButtonElement).disabled = true));
      }
      if (this.dictionaryController.getDictionaryPage() === this.dictionaryController.getMaxDictionaryPage()) {
        next.forEach((item) => ((item as HTMLButtonElement).disabled = true));
      }
    }
    if (this.dictionaryController.getDifficultWordsPage() > this.dictionaryController.getMaxDifficultWordsPage()) {
      this.dictionaryController.setDifficultWordsPage(this.dictionaryController.getMaxDifficultWordsPage());
    }
    document
      .querySelectorAll('.dictionary-page-number')
      .forEach(
        (item) =>
          (item.innerHTML = `<span class='dictionary-page-current'>${
            this.dictionaryController.getDictionaryGroup() !== 6
              ? this.dictionaryController.getDictionaryPage() + 1
              : this.dictionaryController.getDifficultWordsPage() + 1
          }</span><span> / </span><span class='dictionary-page-all'>${
            this.dictionaryController.getDictionaryGroup() !== 6
              ? this.dictionaryController.getMaxDictionaryPage() + 1
              : this.dictionaryController.getMaxDifficultWordsPage() + 1
          }</span>`)
      );
  }
}

export default Dictionary;
