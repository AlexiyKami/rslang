import './navigation.scss';
import View from '../view';
import Controller from '../../controller/controller';

export default class Navigation {
  private readonly navEl: HTMLElement;
  private readonly radioIdLabelMap = new Map<string, string>([
    ['radio-home', 'Home'],
    ['radio-book', 'Textbook'],
    ['radio-games', 'Minigames'],
    ['radio-stat', 'Statistics'],
  ]);

  private readonly NavPageElMap = new Map<HTMLLabelElement, HTMLInputElement>();

  constructor(private readonly controller: Controller, private readonly view: View) {
    this.navEl = document.createElement('nav');
    this.navEl.classList.add('page-nav');

    for (const entry of this.radioIdLabelMap) {
      const radioEl = document.createElement('input');
      radioEl.type = 'radio';
      radioEl.name = 'navigation';
      radioEl.id = entry[0];
      radioEl.value = entry[0];

      const radioLabelEl = document.createElement('label');
      radioLabelEl.setAttribute('for', entry[0]);
      radioLabelEl.innerText = entry[1];

      this.NavPageElMap.set(radioLabelEl, radioEl);

      if (entry[1] === 'Textbook')
        radioLabelEl.addEventListener('click', () => {
          this.controller.playStopAudio('', false);
          this.view.dictionary.draw();
        });
      else if (entry[1] === 'Minigames')
        radioLabelEl.addEventListener('click', () => {
          this.controller.playStopAudio('', false);
          this.view.MinigamesPage.renderMinigamesPage();
        });
      else if (entry[1] === 'Home')
        radioLabelEl.addEventListener('click', () => {
          this.controller.playStopAudio('', false);
          this.view.mainPage.renderMainPage();
        });

      this.navEl.append(radioEl, radioLabelEl);
    }

    this.setCurPage(this.controller.navController.curPage);
    if (this.controller.navController.curPage === 1) {
      this.view.dictionary.draw();
    } else if (this.controller.navController.curPage === 2) {
      this.view.MinigamesPage.renderMinigamesPage();
    }

    this.navEl.addEventListener('mouseup', (event: Event) => {
      const target = event.target as HTMLLabelElement;
      if (this.NavPageElMap.has(target))
        this.controller.navController.curPage = [...this.NavPageElMap.keys()].indexOf(target);
    });

    document.getElementsByTagName('body')[0].prepend(this.navEl);
  }

  public hideNav() {
    this.navEl.classList.add('hide-nav');
  }

  public showNav() {
    this.navEl.classList.remove('hide-nav');
  }

  public setCurPage(pageNum: number) {
    [...this.NavPageElMap.values()][pageNum].checked = true;
  }
}
