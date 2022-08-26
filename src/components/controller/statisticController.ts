import Controller from './controller';
import { GameState, GameStatistic, Optional } from '../types/types';
import { isEmptyObj } from '../utils/utils';

class StatisticController {
  private userId: string;
  private token: string;

  constructor(private readonly controller: Controller) {
    this.userId = this.controller.authorizationController.userId as string;
    this.token = this.controller.authorizationController.token as string;
  }

  public async saveGameStatistic(gameName: 'sprint' | 'audiochallenge', gameState: GameState) {
    const userStat = await this.controller.api.getStatistics(this.userId, this.token);

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

    await this.controller.api.upsertStatistics(this.userId, 0, optional, this.token);
  }
}

export default StatisticController;
