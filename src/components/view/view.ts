import Controller from '../controller/controller';
import Dictionary from './dictionary/dictionary';
import Navigation from './navigation/navigation';
import Authorization from './authorization/authorization';
import AudioChallengeView from './audioChallenge/audioChallengeView';
import MinigamesPageView from './minigamesPage/minigamesPageView';
import { getElement } from '../utils/utils';
import LoadingPopup from './loading-popup/loadingPopup';
import MainPage from './mainPage/mainPage';
import Sprint from './sprint/sprint';
import StatisticsPage from './statisticsPage/statisticsPage';

class View {
  public dictionary: Dictionary;
  public audioChallenge: AudioChallengeView;
  public navigation: Navigation;
  public authorization: Authorization;
  public MinigamesPage: MinigamesPageView;
  public loadingPopup: LoadingPopup;
  public mainPage: MainPage;
  public statisticsPage: StatisticsPage;
  public sprint: Sprint;

  constructor(private readonly controller: Controller) {
    this.authorization = new Authorization(this.controller);
    this.dictionary = new Dictionary(this.controller, this);
    this.audioChallenge = new AudioChallengeView(this.controller, this);
    this.MinigamesPage = new MinigamesPageView(this.controller, this);
    this.loadingPopup = new LoadingPopup(this.controller);
    this.mainPage = new MainPage(this, this.controller);
    this.statisticsPage = new StatisticsPage(this.controller, this);
    this.navigation = new Navigation(this.controller, this);
    this.sprint = new Sprint(this.controller, this);
  }

  public changeAppTitle(title: string): void {
    (getElement('app-title') as HTMLTitleElement).textContent = title;
  }

  public hideFooter(hide = true): void {
    const footer = getElement('footer') as HTMLElement;
    const action = hide ? 'add' : 'remove';
    footer.classList[action]('hidden');
  }
}

export default View;
