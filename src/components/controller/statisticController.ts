import Controller from './controller';
import { GameState, GameStatistic, Optional, UserWord, Word, WordOptional } from '../types/types';
import { isEmptyObj } from '../utils/utils';

class StatisticController {
  private readonly userId: string;

  constructor(private readonly controller: Controller) {
    this.userId = this.controller.authorizationController.userId as string;
  }

  private async saveWordStatistic(word: Word, isSuccessful: boolean, userWords: UserWord[]) {
    const token = this.controller.authorizationController.token as string;
    const wordStat = {
      difficulty: 'easy',
      optional: {
        successfulAttempts: 0,
        failedAttempts: 0,
        isLearned: false,
        inRow: 0,
      },
    };

    const userWord = userWords.find((el) => el.wordId === word.id);
    if (userWord) {
      if (userWord.difficulty) wordStat.difficulty = userWord.difficulty;
      if (userWord.optional !== undefined) Object.assign(wordStat.optional as WordOptional, userWord.optional);
    }

    if (isSuccessful) {
      wordStat.optional.successfulAttempts++;
      wordStat.optional.inRow++;
      if (
        (wordStat.difficulty === 'easy' && wordStat.optional.inRow >= 3) ||
        (wordStat.difficulty === 'hard' && wordStat.optional.inRow >= 5)
      )
        wordStat.optional.isLearned = true;
    }

    if (!isSuccessful) {
      wordStat.optional.failedAttempts++;
      wordStat.optional.inRow = 0;
      wordStat.optional.isLearned = false;
    }

    console.log(wordStat);

    if (!userWord) {
      await this.controller.api.createUserWord(this.userId, word.id, wordStat.difficulty, wordStat.optional, token);
      console.log('Word created');
    } else {
      await this.controller.api.updateUserWord(this.userId, word.id, wordStat.difficulty, wordStat.optional, token);
      console.log('Word updated');
    }
  }

  private async saveWordsStatistic(gameState: GameState, userWords: UserWord[]) {
    const promises: Promise<void>[] = [];
    gameState.rightWords.forEach((word) => promises.push(this.saveWordStatistic(word, true, userWords)));
    gameState.wrongWords.forEach((word) => promises.push(this.saveWordStatistic(word, false, userWords)));
    await Promise.all(promises);
    console.log('Saved');
  }

  public async saveGameStatistic(gameName: 'sprint' | 'audiochallenge', gameState: GameState) {
    const token = this.controller.authorizationController.token as string;
    const userWordsResponse = await this.controller.api.getAllUserWords(this.userId, token);
    const userWords = userWordsResponse.data;

    if (typeof userWords !== 'string') await this.saveWordsStatistic(gameState, userWords);

    const userStat = await this.controller.api.getStatistics(this.userId, token);

    const optional: Optional = {};
    if (
      typeof userStat.data !== 'string' &&
      userStat.data.optional !== undefined &&
      !isEmptyObj(userStat.data.optional)
    ) {
      Object.assign(optional, userStat.data.optional);
    }
    const statName: 'sprintStatistic' | 'audiochallengeStatistic' = `${gameName}Statistic`;
    const date = new Date().toDateString();
    const serverStat = optional[statName] as GameStatistic | undefined;

    const stat: GameStatistic = {
      date: '',
      newWords: 0,
      rightWords: 0,
      wrongWords: 0,
      maxInRow: 0,
    };

    if (serverStat !== undefined && serverStat.date === date) {
      Object.assign(stat, optional[statName]);
    }

    stat.date = date;
    stat.rightWords += gameState.rightWords.length;
    stat.wrongWords += gameState.wrongWords.length;
    stat.maxInRow = gameState.maxRightWordsInRow > stat.maxInRow ? gameState.maxRightWordsInRow : stat.maxInRow;

    optional[statName] = stat;
    console.log(optional);

    await this.controller.api.upsertStatistics(this.userId, 0, optional, token);
  }
}

export default StatisticController;
