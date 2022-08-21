import AppModel from '../app';
import { AudioChallengeModelState, Word } from '../../types/types';
import View from '../../view/view';
import { getRandomNumber } from '../../utils/utils';

class AudioChallengeModel {
  state: AudioChallengeModelState;

  constructor(private readonly view: View, private readonly model: AppModel) {
    this.state = {
      currentWords: [],
      currentWordIndex: 0,
      currentGuessingWords: [],
      rightWords: [],
      wrongWords: [],
    };
  }

  private shuffleWords<T>(array: T[]) {
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
  }

  public onWordsLoadError(errorMessage: string): void {
    this.resetState();
    this.view.audioChallenge.renderOnWordsLoadErrorMessage(errorMessage);
  }

  public onWordsLoad(words: Word[]) {
    this.state.currentWords = words;
    this.shuffleWords(this.state.currentWords);
    this.getThreeRandomWords();
    console.log(this.state.currentWords[this.state.currentWordIndex], this.state.currentGuessingWords);
    this.view.audioChallenge.renderAudioChallengeGamePage(this.state);
  }

  public onWordSelected(word: Word, isRightAnswer: boolean) {
    const rightOrWrong = isRightAnswer ? 'rightWords' : 'wrongWords';
    this.state[rightOrWrong].push(word);
    this.view.audioChallenge.updatePageOnWordSelect(this.state, isRightAnswer);
  }

  public onNextButtonClick(nextButtonText: string | null) {
    console.log(nextButtonText, this.state.currentWordIndex);
    this.state.currentWordIndex++;
    console.log(this.state.currentWordIndex);
  }
}

export default AudioChallengeModel;
