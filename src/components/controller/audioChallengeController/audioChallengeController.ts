import Controller from '../controller';
import AppModel from '../../app/app';
import { getRandomNumber } from '../../utils/utils';
import settings from '../../settings';

class AudioChallengeController {
  constructor(private readonly controller: Controller, private readonly model: AppModel) {}

  async startPageHandler(e: Event) {
    // TODO implement
    console.log(e.target);
    console.log(this);
    console.log(this.controller);
    const target = e.target as HTMLElement;
    if (target.classList.contains('audio-challenge__difficulty-button')) {
      const group = +(target.dataset.group || 0);
      const page = getRandomNumber(0, settings.MAX_DICTIONARY_PAGES);
      const words = await this.controller.api.getWords(group, page);
      console.log(typeof words, 'WORDS:', words);
      if (typeof words == 'string') {
        console.log(this);
        this.model.audioChallengeModel.onWordsLoadError(words);
      }
    }
  }
}

export default AudioChallengeController;
