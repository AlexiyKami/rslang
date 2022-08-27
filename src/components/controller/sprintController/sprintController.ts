import Controller from '../controller';
import AppModel from '../../app/app';
import { Word, UserWord } from '../../types/types';
// import { getElement, getRandomNumber } from '../../utils/utils';
// import settings from '../../settings';
// import { AudioChallengeKeycodesToHandle } from '../../types/types';

export default class SprintController {
  private words: Word[] = [];
  private curWordInd = 0;
  private word = '';
  private correctWord = '';
  private series = 0;
  private points = 10;
  private result = 0;

  constructor(private readonly controller: Controller, private readonly model: AppModel) {}

  public initGame(group: number, page = 29, fromTextBook = true) {
    this.controller.showLoadingPopup();
    this.getWords(group, page, fromTextBook).then((words: Word[]) => {
      this.model.view.sprint.renderSprintGame();
      this.words = words;
      this.curWordInd = 0;
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
    if (++this.curWordInd === this.words.length) this.curWordInd = 0;
  }

  public answer(isRight: boolean) {
    if (isRight === (this.word === this.correctWord)) {
      this.addSeries();
      this.result += this.points;
      this.model.view.sprint.setResult(this.result);
    } else {
      this.clearSeries();
    }
    this.setWordAndTranslate();
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
      this.points = this.points * 2;
      this.model.view.sprint.setPoints(this.points);
    }
  }

  private clearSeries() {
    this.points = 10;
    this.series = 0;
    this.model.view.sprint.setPoints(10);
    this.model.view.sprint.setSeries(0);
  }
}
