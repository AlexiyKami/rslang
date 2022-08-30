import Controller from './controller';
import {
  AggregatedWord,
  GameState,
  GameStatistic,
  StatisticsOptional,
  UserWord,
  Word,
  WordOptional,
} from '../types/types';
import { merge } from 'lodash';

class StatisticController {
  private readonly userId: string;

  constructor(private readonly controller: Controller) {
    this.userId = this.controller.authorizationController.userId as string;
  }

  private async saveWordStatistic(word: Word | AggregatedWord, isSuccessful: boolean, userWords: UserWord[]) {
    const token = this.controller.authorizationController.token as string;
    let learnedWordsCount = 0;
    const wordStat = {
      difficulty: 'easy',
      optional: {
        successfulAttempts: 0,
        failedAttempts: 0,
        isLearned: false,
        inRow: 0,
      },
    };

    const wordId = (word as Word).id || (word as AggregatedWord)._id;
    const userWord = userWords.find((el) => el.wordId === wordId);

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
      ) {
        wordStat.optional.isLearned = true;
        learnedWordsCount++;
      }
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
    return learnedWordsCount;
  }

  private async saveWordsStatistic(gameState: GameState, userWords: UserWord[]) {
    const promises: Promise<number>[] = [];
    gameState.rightWords.forEach((word) => promises.push(this.saveWordStatistic(word, true, userWords)));
    gameState.wrongWords.forEach((word) => promises.push(this.saveWordStatistic(word, false, userWords)));
    const numArr = await Promise.all(promises);
    return numArr.reduce((acc, num) => acc + num, 0);
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

    const date = new Date().toDateString();
    const newWordsCount = typeof userWords !== 'string' ? this.newWordsCount(gameState, userWords) : 0;

    let learnedWords = 0;
    if (typeof userWords !== 'string') learnedWords = await this.saveWordsStatistic(gameState, userWords);

    const userStat = await this.controller.api.getStatistics(this.userId, token);
    const userStatLearnedWords = typeof userStat.data !== 'string' ? userStat.data.learnedWords || 0 : 0;

    const optional: StatisticsOptional = {
      registrationDate: date,
      globalStatistics: {
        [date]: {
          newWords: 0,
          learnedWords: 0,
        },
      },
    };

    if (typeof userStat.data !== 'string') merge(optional, userStat.data.optional);
    (optional.globalStatistics[date].newWords as number) += newWordsCount;
    (optional.globalStatistics[date].learnedWords as number) += learnedWords;

    const statName: 'sprintStatistics' | 'audioChallengeStatistics' = `${gameName}Statistics`;

    const serverStat = optional[statName] as GameStatistic | undefined;

    const gameStat: GameStatistic = {
      date: '',
      newWords: 0,
      rightWords: 0,
      wrongWords: 0,
      maxInRow: 0,
    };

    if (serverStat !== undefined && serverStat.date === date) {
      Object.assign(gameStat, serverStat);
    }

    gameStat.date = date;
    gameStat.newWords += newWordsCount;
    gameStat.rightWords += gameState.rightWords.length;
    gameStat.wrongWords += gameState.wrongWords.length;
    gameStat.maxInRow =
      gameState.maxRightWordsInRow > gameStat.maxInRow ? gameState.maxRightWordsInRow : gameStat.maxInRow;

    optional[statName] = gameStat;

    await this.controller.api.upsertStatistics(this.userId, userStatLearnedWords + learnedWords, optional, token);
  }
}

export default StatisticController;
