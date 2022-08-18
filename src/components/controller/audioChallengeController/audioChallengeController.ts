import Controller from '../controller';
import AppModel from '../../app/app';

class AudioChallengeController {
  constructor(private readonly controller: Controller, private readonly model: AppModel) {}

  startPageHandler(e: Event) {
    // TODO implement
    console.log(e.target);
  }
}

export default AudioChallengeController;
