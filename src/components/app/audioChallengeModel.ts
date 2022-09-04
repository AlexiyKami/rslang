import { AggregatedWord, AudioChallengeModelState, Word } from '../types/types';
import View from '../view/view';
import { getRandomNumber } from '../utils/utils';

class AudioChallengeModel {
  state: AudioChallengeModelState;

  constructor(private readonly view: View) {
    this.state = {
      currentWords: [],
      currentWordIndex: 0,
      currentGuessingWords: [],
      rightWords: [],
      wrongWords: [],
      currentRightWordsInRow: 0,
      maxRightWordsInRow: 0,
    };
  }

  public initGame(): void {
    this.resetState();
    this.view.audioChallenge.renderStartPage();
  }

  private shuffleWords<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private getThreeRandomWords(): void {
    const wordsIndex: number[] = [this.state.currentWordIndex];
    while (wordsIndex.length < 4) {
      const randomNumber = getRandomNumber(0, this.state.currentWords.length - 1);
      if (randomNumber !== this.state.currentWordIndex && !wordsIndex.includes(randomNumber))
        wordsIndex.push(randomNumber);
    }
    this.shuffleWords(wordsIndex);
    this.state.currentGuessingWords = wordsIndex.map((number) => this.state.currentWords[number]);
  }

  private resetState(): void {
    this.state.currentWordIndex = 0;
    this.state.currentGuessingWords.length = 0;
    this.state.currentWords.length = 0;
    this.state.rightWords.length = 0;
    this.state.wrongWords.length = 0;
    this.state.currentRightWordsInRow = 0;
    this.state.maxRightWordsInRow = 0;
  }

  public onWordsLoadError(errorMessage: string): void {
    this.resetState();
    this.view.audioChallenge.renderOnWordsLoadErrorMessage(errorMessage);
  }

  public onWordsLoad(words: Word[] | AggregatedWord[]): void {
    this.resetState();
    this.state.currentWords = words;
    this.shuffleWords(this.state.currentWords);
    this.getThreeRandomWords();
    this.view.audioChallenge.renderGamePage(this.state);
  }

  public onWordSelected(word: Word | AggregatedWord, isRightAnswer: boolean): void {
    const rightOrWrong = isRightAnswer ? 'rightWords' : 'wrongWords';
    this.state[rightOrWrong].push(word);
    if (isRightAnswer) {
      this.state.currentRightWordsInRow++;
      if (this.state.maxRightWordsInRow < this.state.currentRightWordsInRow)
        this.state.maxRightWordsInRow = this.state.currentRightWordsInRow;
    } else {
      this.state.currentRightWordsInRow = 0;
    }
    this.view.audioChallenge.updatePageOnWordSelect(this.state, isRightAnswer);
  }

  public onNextButtonClick(nextButtonText: string | null): void {
    if (nextButtonText === `Show results`) {
      this.view.audioChallenge.renderResultsPage(this.state);
    } else {
      if (nextButtonText === `I don't know`) this.state.currentRightWordsInRow = 0;
      this.state.currentWordIndex++;
      this.getThreeRandomWords();
      this.view.audioChallenge.updateGamePage(this.state);
    }
  }
}

export default AudioChallengeModel;
