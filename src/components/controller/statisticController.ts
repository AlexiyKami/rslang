import Controller from './controller';
import {
  AggregatedWord,
  GameState,
  GameStatistic,
  Optional,
  StatisticsData,
  UserWord,
  Word,
  WordOptional,
} from '../types/types';
import { isEmptyObj } from '../utils/utils';

class StatisticController {
  private readonly userId: string;

  constructor(private readonly controller: Controller) {
    this.userId = this.controller.authorizationController.userId as string;
  }

  private async saveWordStatistic(word: Word | AggregatedWord, isSuccessful: boolean, userWords: UserWord[]) {
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

    const userWord = userWords.find((el) => el.wordId === (word as Word).id || (word as AggregatedWord)._id);
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

    if (!userWord) {
      await this.controller.api.createUserWord(
        this.userId,
        (word as Word).id || (word as AggregatedWord)._id,
        wordStat.difficulty,
        wordStat.optional,
        token
      );
    } else {
      await this.controller.api.updateUserWord(
        this.userId,
        (word as Word).id || (word as AggregatedWord)._id,
        wordStat.difficulty,
        wordStat.optional,
        token
      );
    }
  }

  private async saveWordsStatistic(gameState: GameState, userWords: UserWord[]) {
    const promises: Promise<void>[] = [];
    gameState.rightWords.forEach((word) => promises.push(this.saveWordStatistic(word, true, userWords)));
    gameState.wrongWords.forEach((word) => promises.push(this.saveWordStatistic(word, false, userWords)));
    await Promise.all(promises);
  }

  private newWordsCount(gameState: GameState, userWords: UserWord[]) {
    let newWordsCount = 0;
    const gameWords = [...gameState.wrongWords, ...gameState.rightWords];
    const gameWordsIds = gameWords.map((word) => (word as Word).id || (word as AggregatedWord)._id);
    const userWordsIds = userWords.map((word) => word.wordId);
    gameWordsIds.forEach((gameWordId) => {
      if (!userWordsIds.includes(gameWordId)) {
        newWordsCount++;
      } else {
        const userWord = userWords.find((word) => word.wordId === gameWordId) as UserWord;
        if (userWord.optional?.successfulAttempts === 0 && userWord.optional?.failedAttempts === 0) {
          newWordsCount++;
        }
      }
    });
    return newWordsCount;
  }

  public async saveGameStatistic(gameName: 'sprint' | 'audioChallenge', gameState: GameState) {
    const token = this.controller.authorizationController.token as string;
    const userWordsResponse = await this.controller.api.getAllUserWords(this.userId, token);
    const userWords = userWordsResponse.data;
    const newWordsCount = typeof userWords !== 'string' ? this.newWordsCount(gameState, userWords) : 0;

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
    const statName: 'sprintStatistics' | 'audioChallengeStatistics' = `${gameName}Statistics`;
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
    stat.newWords += newWordsCount;
    stat.rightWords += gameState.rightWords.length;
    stat.wrongWords += gameState.wrongWords.length;
    stat.maxInRow = gameState.maxRightWordsInRow > stat.maxInRow ? gameState.maxRightWordsInRow : stat.maxInRow;

    optional[statName] = stat;

    await this.controller.api.upsertStatistics(this.userId, 0, optional, token);
    await this.updateGlobalStatistics();
  }

  public async updateGlobalStatistics() {
    const token = this.controller.authorizationController.token as string;
    const statistics = await this.controller.api.getStatistics(this.userId, token);
    const audioChallengeStats = [
      ((statistics.data as StatisticsData).optional?.audioChallengeStatistics as GameStatistic)?.date,
      ((statistics.data as StatisticsData).optional?.audioChallengeStatistics as GameStatistic)?.newWords,
    ];
    const sprintStats = [
      ((statistics.data as StatisticsData).optional?.sprintStatistics as GameStatistic)?.date,
      ((statistics.data as StatisticsData).optional?.sprintStatistics as GameStatistic)?.newWords,
    ];
    const sumNewWords = +(audioChallengeStats[1] || 0) + +(sprintStats[1] || 0);
    const optional = (statistics.data as StatisticsData).optional;
    if (audioChallengeStats[0] === new Date().toDateString() || sprintStats[0] === new Date().toDateString()) {
      if (optional.globalStatistics[new Date().toDateString()]) {
        (optional.globalStatistics[new Date().toDateString()].newWords as number) = sumNewWords;
      } else {
        optional.globalStatistics = {
          ...optional.globalStatistics,
          [new Date().toDateString()]: { newWords: sumNewWords, learnedWords: 0 },
        };
      }
    }
    await this.controller.api.upsertStatistics(this.userId, 0, optional, token);
    console.log(statistics);
  }
}

export default StatisticController;
