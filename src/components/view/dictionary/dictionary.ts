import settings from '../../settings';
import { Word } from '../../types/types';
import './dictionary.scss';
import DictionaryController from '../../controller/dictionaryController';
import Controller from '../../controller/controller';

class Dictionary {
  dictionaryController: DictionaryController;
  baseController: Controller;

  constructor(controller: Controller) {
    this.baseController = controller;
    this.dictionaryController = controller.dictionary;
    this.dictionaryController.onDictionaryUpdate.push(
      this.clear.bind(this),
      this.draw.bind(this),
      this.baseController.playStopAudio.bind(controller, '', false)
    );
  }

  draw(): void {
    const wrapper = `<div class='dictionary'>
      <div class='dictionary-pagination'>
        <button class='rounded-button prev' disabled>Prev</button>
        <h4 class="dictionary-page-number">1</h4>
        <button class='rounded-button next'>Next</button>
      </div>
      <div class='dictionary-groups'>
        <span>Difficulty</span>
        <div class='group-buttons'>
          <button class='round-button group-1'>1</button>
          <button class='round-button group-2'>2</button>
          <button class='round-button group-3'>3</button>
          <button class='round-button group-4'>4</button>
          <button class='round-button group-5'>5</button>
          <button class='round-button group-6'>6</button>
          <button class='round-button group-7'>7</button>
        </div>
      </div>
      <div class='dictionary-words'>
      
      </div>
    </div>`;
    (document.querySelector('main') as HTMLElement)?.insertAdjacentHTML('beforeend', wrapper);
    (document.querySelector('.group-buttons') as HTMLElement).childNodes.forEach((elem) => {
      elem.addEventListener('click', () => {
        this.dictionaryController.setDictionaryGroup(+(elem.textContent as string) - 1);
      });
    });
    (document.querySelector('.dictionary-pagination') as HTMLElement).addEventListener('click', (e) =>
      this.onPaginationClick(e)
    );
    this.updatePagination();
    this.updateGroupButtons();
    this.updateWords();
  }

  async updateWords() {
    const words = await this.dictionaryController.getWords();
    let items;
    if (typeof words === 'string') {
      items = words;
    } else {
      items = (words as unknown as Word[])
        .map((word) => {
          return `<div class='word-card'>
            <img class='image' src='${settings.DATABASE_URL}/${word.image}'>
            <div class='description'>
              <div class='title'>
                <span class='word'>${word.word.charAt(0).toUpperCase() + word.word.slice(1)}</span>
                <span class='transcription'>${word.transcription}</span>
                <div class='translation'>${word.wordTranslate}</div>
              </div>
              <div class='text-example'>
                <p>${word.textExample}</p>
                <p class='translation'>${word.textExampleTranslate}</p>
              </div>
              <div class='text-meaning'>
                <p>${word.textMeaning}</p>
                <p class='translation'>${word.textMeaningTranslate}</p>
              </div>
            </div>
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
        const audioURL = [
          currTarget.getAttribute('audio'),
          currTarget.getAttribute('audio-example'),
          currTarget.getAttribute('audio-meaning'),
        ];
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
  }

  private audioHandler(currTarget: HTMLElement, audioFile: string) {
    if (!currTarget.classList.contains('playing')) {
      this.baseController.playStopAudio(audioFile as string);
      document.querySelectorAll('.audio-image.playing').forEach((img) => img.classList.remove('playing'));
      currTarget.classList.add('playing');
    } else {
      this.baseController.playStopAudio('', false);
      currTarget.classList.remove('playing');
    }
  }

  private updateGroupButtons() {
    (document.querySelector('.group-buttons') as HTMLElement).childNodes.forEach((elem) => {
      (elem as HTMLButtonElement).disabled = false;
      if (+(elem.textContent as string) === this.dictionaryController.getDictionaryGroup() + 1) {
        (elem as HTMLButtonElement).disabled = true;
      }
    });
  }

  private onPaginationClick(e: Event) {
    const target = e.target as HTMLElement;
    const page = this.dictionaryController.getDictionaryPage();
    if (target.classList.contains('prev')) {
      this.dictionaryController.setDictionaryPage(page - 1);
    }
    if (target.classList.contains('next')) {
      this.dictionaryController.setDictionaryPage(page + 1);
    }
  }

  private updatePagination() {
    const prev = document.querySelector('.dictionary-pagination .prev') as HTMLButtonElement;
    const next = document.querySelector('.dictionary-pagination .next') as HTMLButtonElement;
    prev.disabled = false;
    next.disabled = false;
    if (this.dictionaryController.getDictionaryPage() <= 0) {
      prev.disabled = true;
    }
    if (this.dictionaryController.getDictionaryPage() === this.dictionaryController.getMaxDictionaryPage()) {
      next.disabled = true;
    }
    (document.querySelector('.dictionary-page-number') as Element).innerHTML = `${
      this.dictionaryController.getDictionaryPage() + 1
    } / ${this.dictionaryController.getMaxDictionaryPage() + 1}`;
  }

  clear(): void {
    document.querySelector('.dictionary')?.remove();
  }
}

export default Dictionary;
