import Controller from '../controller/controller';
import View from '../view/view';
import AudioChallengeModel from './audioChallengeModel/audioChallengeModel';

class AppModel {
  public controller: Controller;

  public view: View;

  public audioChallengeModel: AudioChallengeModel;

  constructor() {
    this.controller = new Controller(this);
    this.view = new View(this.controller);
    this.audioChallengeModel = new AudioChallengeModel(this.view, this);
  }

  initApp() {
    this.view.initRender();
  }
}

export default AppModel;
