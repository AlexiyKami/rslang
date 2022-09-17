import '../../../assets/images/ivan.jpg';
import '../../../assets/images/main-page-1.jpg';
import '../../../assets/images/main-page-2.jpg';
import './mainPage.scss';
import View from '../view';
import Controller from '../../controller/controller';
import { getElement } from '../../utils/utils';

class MainPage {
  constructor(private readonly view: View, private readonly controller: Controller) {}

  public renderMainPage(): void {
    this.view.changeAppTitle('RSLang');
    this.view.hideFooter(false);
    const mainWindow = getElement('main-window') as HTMLElement;

    mainWindow.innerHTML = `
    <div class="main-page">

      <section class="main-page__header">
        <h2 class="main-page__header-title">Boost your vocabulary with RSLang</h2>
        <p class="main-page__header-subtitle">Traditional and new effective approaches to learning words, motivation
          in the form of statistics, various levels of difficulty - you will find all this in RSLang.</p>
        <button class="main-page__header-button orange flat-button" type="button">Let's start</button>
      </section>

      <img class="main-page__header-img" src="./assets/images/main-page-1.jpg" alt="RSLang">

      <section class="main-page__advantages">
        <h2 class="main-page__advantages-title">Why learn English with us?</h2>

        <div class="main-page__advantages-cards">
          <div class="main-page__advantages-card">
            <svg class="main-page__advantages-card-img red" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"></path>
            </svg>
            <h2 class="main-page__advantages-card-title">Textbook</h2>
            <p class="main-page__advantages-card-text">The electronic textbook consists of six sections. Each section
              has 30 pages of 20 words. The translation of the word, the thematic image, as well as the pronunciation of
              both the word separately and as part of the phrase are presented.</p>
            <button class="main-page__advantages-card-button main-page__advantages-card-button_textbook blue flat-button" type="button">Let's learn</button>
          </div>

          <div class="main-page__advantages-card">
            <svg class="main-page__advantages-card-img orange" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path>
            </svg>
            <h2 class="main-page__advantages-card-title">Dictionary</h2>
            <p class="main-page__advantages-card-text">The dictionary contains lists of studied words, words that do not
              need to be learned, as well as those that cause difficulties. The dictionary reflects statistics for each
              section and student progress (for registered users only).</p>
            <button class="main-page__advantages-card-button main-page__advantages-card-button_dictionary marine flat-button" type="button">Go</button>
          </div>

          <div class="main-page__advantages-card">
            <svg class="main-page__advantages-card-img marine" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path>
            </svg>
            <h2 class="main-page__advantages-card-title">Games</h2>
            <p class="main-page__advantages-card-text">For learning words and reinforcing memorization, the application
              has 2 games: Sprint and Audio Challenge, which will help you to "pump" your
              vocabulary in a playful way.</p>
            <button class="main-page__advantages-card-button main-page__advantages-card-button_games orange flat-button" type="button">Play</button>
          </div>

          <div class="main-page__advantages-card">
            <svg class="main-page__advantages-card-img blue" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z"></path>
            </svg>
            <h2 class="main-page__advantages-card-title">Statistics</h2>
            <p class="main-page__advantages-card-text">All the progress of training can be viewed in statistics, where
              data for the current day, as well as for the entire training period, are presented.</p>
            <button class="main-page__advantages-card-button main-page__advantages-card-button_statistic red flat-button" type="button">Show me</button>
          </div>
        </div>
      </section>

      <section class="main-page__login">
        <h2 class="main-page__login-title">Register</h2>
        <p class="main-page__login-text">If you want to see statistics for all time and have access to the dictionary,
          please log in or sign up first.</p>
        <button class="main-page__login-button green flat-button" type="button">Login / Sign up</button>
      </section>

      <img class="main-page__our-team-img" src="./assets/images/main-page-2.jpg" alt="RSLang Team">

      <section class="main-page__our-team">
        <h2 class="main-page__our-team-title">Our Team</h2>
        <div class="main-page__our-team-members">
          <div class="member-card">
            <div class="member-card__member-photo-wrapper">
              <div class="member-card__member-photo ivan"></div>
            </div>
            <h3 class="member-card__name">Ivan Aliseiko</h3>
            <a class="member-card__github-link" href="https://github.com/Aliseiko" target="_blank"></a>
            <p class="member-card__role">Developer</p>
            <p class="member-card__role-text">Work with API, develop main page, minigames page, Audio Challenge
              minigame, design & styles</p>
          </div>

          <div class="member-card">
            <div class="member-card__member-photo-wrapper">
              <div class="member-card__member-photo alex"></div>
            </div>
            <h3 class="member-card__name">Alexey Matsyl</h3>
            <a class="member-card__github-link" href="https://github.com/AlexiyKami" target="_blank"></a>
            <p class="member-card__role">Developer</p>
            <p class="member-card__role-text">Setting up environment, develop dictionary and textbook, statistics page</p>
          </div>

          <div class="member-card">
            <div class="member-card__member-photo-wrapper">
              <div class="member-card__member-photo anton"></div>
            </div>
            <h3 class="member-card__name">Anton Shcherba</h3>
            <a class="member-card__github-link" href="https://github.com/Anton-Shcherba" target="_blank"></a>
            <p class="member-card__role">Developer</p>
            <p class="member-card__role-text">Work with authorisation, develop navigation, Sprint minigame</p>
          </div>
        </div>
      </section>
    </div>
    `;

    const dictionaryButton = getElement('main-page__advantages-card-button_dictionary') as HTMLButtonElement;
    if (!this.controller.isAuthorized()) dictionaryButton.disabled = true;

    (getElement('main-page__header-button') as HTMLButtonElement).addEventListener('click', () => {
      window.scrollTo(0, 0);
      if (this.controller.dictionary.getDictionaryGroup() !== 6) this.view.dictionary.draw();
      else this.controller.dictionary.setDictionaryGroup(0);
      this.controller.navController.curPage = 1;
    });

    (getElement('main-page__advantages-card-button_textbook') as HTMLButtonElement).addEventListener('click', () => {
      window.scrollTo(0, 0);
      if (this.controller.dictionary.getDictionaryGroup() !== 6) this.view.dictionary.draw();
      else this.controller.dictionary.setDictionaryGroup(0);
      this.controller.navController.curPage = 1;
    });

    (getElement('main-page__advantages-card-button_games') as HTMLButtonElement).addEventListener('click', () => {
      window.scrollTo(0, 0);
      this.view.MinigamesPage.renderMinigamesPage();
      this.controller.navController.curPage = 3;
    });

    (getElement('main-page__login-button') as HTMLButtonElement).addEventListener('click', () =>
      this.view.authorization.draw()
    );

    (getElement('main-page__advantages-card-button_statistic') as HTMLButtonElement).addEventListener('click', () => {
      window.scrollTo(0, 0);
      this.view.statisticsPage.draw();
      this.controller.navController.curPage = 4;
    });

    (getElement('main-page__advantages-card-button_dictionary') as HTMLButtonElement).addEventListener('click', () => {
      if (this.controller.isAuthorized()) {
        window.scrollTo(0, 0);
        this.controller.dictionary.setDictionaryGroup(6);
        this.controller.navController.curPage = 2;
      }
    });
  }
}

export default MainPage;
