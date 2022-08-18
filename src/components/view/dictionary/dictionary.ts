import settings from '../../settings';
import { Word } from '../../types/types';
import Controller from '../../controller/controller';
import './dictionary.scss';

class Dictionary {
  controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
    this.controller.onDictionaryUpdate.push(this.clear.bind(this), this.draw.bind(this));
  }

  draw(): void {
    const wrapper = `<div class='dictionary'>
      <div class='dictionary-pagination'>
        <button class='prev' disabled>Prev</button>
        <h4 class="dictionary-page-number">1</h4>
        <button class='next'>Next</button>
      </div>
      <div class='dictionary-groups'>
        <span>Difficulty</span>
        <div class='group-buttons'>
          <button class='group-1' disabled>1</button>
          <button class='group-2'>2</button>
          <button class='group-3'>3</button>
          <button class='group-4'>4</button>
          <button class='group-5'>5</button>
          <button class='group-6'>6</button>
          <button class='group-7'>7</button>
        </div>
      </div>
      <div class='dictionary-words'>
      
      </div>
    </div>`;
    (document.querySelector('main') as HTMLElement)?.insertAdjacentHTML('beforeend', wrapper);
    (document.querySelector('.group-buttons') as HTMLElement).childNodes.forEach((elem) => {
      elem.addEventListener('click', () => {
        this.controller.setDictionaryGroup(+(elem.textContent as string) - 1);
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
    const words = await this.controller.getWords();
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
            <div class='audio-image'>
              <audio src=${settings.DATABASE_URL}/${word.audio}></audio>
              <audio></audio>
              <audio></audio>
            </div>
          </div>`;
        })
        .join('');
    }
    document.querySelector('.dictionary-words')?.insertAdjacentHTML('beforeend', items as string);
    document.querySelectorAll('.audio-image').forEach((elem) => {
      elem.addEventListener('click', (e: Event) => {
        const currTarget = e.currentTarget as Element;
        (currTarget.querySelector('audio') as HTMLAudioElement).play();
      });
    });
  }

  private updateGroupButtons() {
    (document.querySelector('.group-buttons') as HTMLElement).childNodes.forEach((elem) => {
      (elem as HTMLButtonElement).disabled = false;
      if (+(elem.textContent as string) === this.controller.getDictionaryGroup() + 1) {
        (elem as HTMLButtonElement).disabled = true;
      }
    });
  }

  private onPaginationClick(e: Event) {
    const target = e.target as HTMLElement;
    const page = this.controller.getDictionaryPage();
    if (target.classList.contains('prev')) {
      this.controller.setDictionaryPage(page - 1);
    }
    if (target.classList.contains('next')) {
      this.controller.setDictionaryPage(page + 1);
    }
  }

  private updatePagination() {
    const prev = document.querySelector('.dictionary-pagination .prev') as HTMLButtonElement;
    const next = document.querySelector('.dictionary-pagination .next') as HTMLButtonElement;
    prev.disabled = false;
    next.disabled = false;
    if (this.controller.getDictionaryPage() <= 0) {
      prev.disabled = true;
    }
    if (this.controller.getDictionaryPage() === this.controller.getMaxDictionaryPage()) {
      next.disabled = true;
    }
    (document.querySelector('.dictionary-page-number') as Element).innerHTML = `${
      this.controller.getDictionaryPage() + 1
    } / ${this.controller.getMaxDictionaryPage() + 1}`;
  }

  clear(): void {
    document.querySelector('.dictionary')?.remove();
  }
}

export default Dictionary;
