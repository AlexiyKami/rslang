import './navigation.scss';
import View from '../view';
import Controller from '../../controller/controller';

export default class Navigation {
  private readonly navEl: HTMLElement;
  private readonly radioIdLabelMap = new Map<string, string>([
    ['radio-home', 'Home'],
    ['radio-book', 'Textbook'],
    ['radio-bookmark', 'Dictionary'],
    ['radio-games', 'Minigames'],
    ['radio-stat', 'Statistics'],
  ]);

  private readonly NavPageElMap = new Map<HTMLLabelElement, HTMLInputElement>();

  constructor(private readonly controller: Controller, private readonly view: View) {
    this.navEl = document.createElement('nav');
    this.navEl.classList.add('page-nav');
    this.navEl.innerHTML = `
    <input id="menu-toggle" type="checkbox">
    <label class='menu-button-container' for="menu-toggle">
      <div class='menu-button'></div>
    </label>
    `;

    for (const entry of this.radioIdLabelMap) {
      if (entry[1] === 'Dictionary' && !controller.isAuthorized()) continue;

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
          if (this.controller.dictionary.getDictionaryGroup() !== 6) this.view.dictionary.draw();
          else this.controller.dictionary.setDictionaryGroup(0);
        });
      else if (entry[1] === 'Dictionary')
        radioLabelEl.addEventListener('click', () => {
          this.controller.playStopAudio('', false);
          this.controller.dictionary.setDictionaryGroup(6);
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
      else if (entry[1] === 'Statistics')
        radioLabelEl.addEventListener('click', () => {
          this.controller.playStopAudio('', false);
          this.view.statisticsPage.draw();
        });
      this.navEl.append(radioEl, radioLabelEl);
    }

    this.setCurPage(this.controller.navController.curPage);
    if (this.controller.navController.curPage === 0) {
      this.view.mainPage.renderMainPage();
    } else if (this.controller.navController.curPage === 1) {
      this.view.dictionary.draw();
    } else if (this.controller.navController.curPage === 2) {
      if (this.controller.isAuthorized()) {
        this.controller.dictionary.setDictionaryGroup(6);
      } else {
        this.controller.dictionary.setDictionaryGroup(1);
        this.controller.navController.curPage = 1;
      }
    } else if (this.controller.navController.curPage === 3) {
      this.view.MinigamesPage.renderMinigamesPage();
    } else if (this.controller.navController.curPage === 4) {
      this.view.statisticsPage.draw();
    }

    this.navEl.addEventListener('mouseup', (event: Event) => {
      const target = event.target as HTMLLabelElement;
      if (this.NavPageElMap.has(target))
        this.controller.navController.curPage = [...this.NavPageElMap.keys()].indexOf(target);
    });

    document.getElementsByTagName('body')[0].prepend(this.navEl);

    const toggle = document.getElementById('menu-toggle') as HTMLElement;
    toggle.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.checked) this.navEl.classList.add('extend');
      else this.navEl.classList.remove('extend');
    });
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
