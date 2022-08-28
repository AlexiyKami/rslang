import Controller from '../controller';
import AppModel from '../../app/app';
import { Word, UserWord, AudioChallengeKeycodesToHandle } from '../../types/types';
import { getRandomNumber } from '../../utils/utils';
import settings from '../../settings';

export default class SprintController {
  private words: Word[] = [];
  private curWordInd = 0;
  private word = '';
  private correctWord = '';
  private series = 0;
  private points = 10;
  private result = 0;

  public group = 0;
  public page = 0;
  public fromTextBook = false;

  public rightAnswers = 0;
  public wrongAnswers = 0;
  public rightWords: Set<Word> = new Set();
  public wrongWords: Set<Word> = new Set();

  public maxInARow = 0;
  private inARow = 0;

  public audio = true;

  constructor(private readonly controller: Controller, private readonly model: AppModel) {}

  public initGame(group: number, fromTextBook = false, page = getRandomNumber(4, settings.MAX_DICTIONARY_PAGES)) {
    this.group = group;
    this.page = page;
    this.fromTextBook = fromTextBook;

    this.controller.showLoadingPopup();
    this.getWords(group, page, fromTextBook).then((words: Word[]) => {
      this.model.view.sprint.renderSprintGame();
      this.words = words;

      this.series = 0;
      this.result = 0;

      this.curWordInd = 0;
      this.rightAnswers = 0;
      this.wrongAnswers = 0;
      this.rightWords.clear();
      this.wrongWords.clear();

      this.maxInARow = 0;
      this.inARow = 0;

      this.setWordAndTranslate();
      this.controller.hideLoadingPopup();
    });
  }

  public initStartPage() {
    this.model.view.sprint.renderStartPage();
  }

  private async getWords(group: number, page: number, fromTextBook: boolean): Promise<Word[]> {
    let words: Word[] = [];

    let userWords: UserWord[] = [];
    if (
      fromTextBook &&
      this.controller.authorizationController.userId &&
      this.controller.authorizationController.token
    ) {
      const userWordsData = await this.controller.api.getAllUserWords(
        this.controller.authorizationController.userId,
        this.controller.authorizationController.token
      );
      if (userWordsData.code === 200) userWords = userWordsData.data as UserWord[];
    }

    for (let i = page; i >= 0; i--) {
      if (words.length >= 100) break;
      let wordsPerPage = await this.controller.api.getWords(group, i);
      if (typeof wordsPerPage !== 'string') {
        if (fromTextBook) wordsPerPage = this.filterWords(wordsPerPage, userWords);
        wordsPerPage.sort(() => Math.random() - 0.5);
        words = words.concat(wordsPerPage);
      }
    }
    return words;
  }

  private filterWords(words: Word[], userWords: UserWord[]): Word[] {
    const filterUserWordsId = userWords
      .filter((userWord: UserWord) => userWord.difficulty === 'hard' || userWord.optional?.isLearned)
      .map((userWord: UserWord) => userWord.wordId);
    return words.filter((word: Word) => !filterUserWordsId.includes(word.id));
  }

  private setWordAndTranslate() {
    const translateWord = this.words[this.curWordInd].wordTranslate;
    this.word =
      Math.random() < 0.5
        ? this.words[this.curWordInd].word
        : this.words[Math.floor(Math.random() * this.words.length)].word;
    this.correctWord = this.words[this.curWordInd].word;
    this.model.view.sprint.setTranslate(translateWord);
    this.model.view.sprint.setWord(this.word);
  }

  public answer(isRight: boolean) {
    if (isRight === (this.word === this.correctWord)) {
      if (this.audio) this.controller.playStopAudio(settings.RIGHT_SOUND_LINK, true, false);
      this.rightWords.add(this.words[this.curWordInd]);
      this.wrongWords.delete(this.words[this.curWordInd]);
      this.rightAnswers++;
      this.inARow++;
      if (this.inARow > this.maxInARow) this.maxInARow = this.inARow;
      this.addSeries();
      this.result += this.points;
      this.model.view.sprint.setResult(this.result);
    } else {
      if (this.audio) this.controller.playStopAudio(settings.WRONG_SOUND_LINK, true, false);
      this.wrongWords.add(this.words[this.curWordInd]);
      this.rightWords.delete(this.words[this.curWordInd]);
      this.wrongAnswers++;
      this.inARow = 0;
      this.clearSeries();
    }

    this.setWordAndTranslate();
    if (++this.curWordInd === this.words.length) this.curWordInd = 0;
  }

  private addSeries() {
    if (this.series === 0) {
      this.model.view.sprint.setSeries(1);
      this.series = 1;
    } else if (this.series === 1) {
      this.model.view.sprint.setSeries(2);
      this.series = 2;
    } else if (this.series === 2) {
      this.model.view.sprint.setSeries(3);
      this.series = 3;
    } else if (this.series === 3) {
      this.model.view.sprint.setSeries(0);
      this.series = 0;
      this.points = this.points + 10;
      this.model.view.sprint.setPoints(this.points);
    }
  }

  private clearSeries() {
    this.points = 10;
    this.series = 0;
    this.model.view.sprint.setPoints(10);
    this.model.view.sprint.setSeries(0);
  }

  public keyboardHandler(e: KeyboardEvent) {
    if (Object.keys(AudioChallengeKeycodesToHandle).includes(e.code)) {
      const button = document.querySelector(`.sprint-group-${e.code}`) as HTMLButtonElement;
      if (button) button.click();
    }
  }

  public toggleAudio() {
    this.audio = !this.audio;
  }

  public setStatistic() {
    if (this.audio) this.controller.playStopAudio(settings.END_GAME_LINK, true, false);
    if (this.controller.isAuthorized())
      this.controller.statisticController.saveGameStatistic('sprint', {
        rightWords: [...this.rightWords],
        wrongWords: [...this.wrongWords],
        maxRightWordsInRow: this.maxInARow,
      });
  }
}
