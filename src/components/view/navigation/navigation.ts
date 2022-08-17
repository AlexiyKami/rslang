import './navigation.scss';

export default class Navigation {
  private readonly btnIdLabel = ['button-login', 'Login'];

  private readonly radioIdLabelMap = new Map<string, string>([
    ['radio-home', 'Home'],
    ['radio-book', 'Textbook'],
    ['radio-games', 'Minigames'],
    ['radio-stat', 'Statistics'],
  ]);

  constructor() {
    const navEl = document.createElement('nav');
    navEl.classList.add('page-nav');

    const btnEl = document.createElement('input');
    btnEl.type = 'button';
    btnEl.id = this.btnIdLabel[0];

    const btnLabelEl = document.createElement('label');
    btnLabelEl.setAttribute('for', this.btnIdLabel[0]);
    btnLabelEl.innerText = this.btnIdLabel[1];

    navEl.append(btnEl, btnLabelEl);

    for (const entry of this.radioIdLabelMap) {
      const radioEl = document.createElement('input');
      radioEl.type = 'radio';
      radioEl.name = 'navigation';
      radioEl.id = entry[0];
      radioEl.value = entry[0];

      const radioLabelEl = document.createElement('label');
      radioLabelEl.setAttribute('for', entry[0]);
      radioLabelEl.innerText = entry[1];

      navEl.append(radioEl, radioLabelEl);
    }

    document.getElementsByTagName('body')[0].prepend(navEl);
  }
}
