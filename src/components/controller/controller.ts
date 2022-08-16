import AppModel from '../app/app';

class Controller {
  private model: AppModel;

  constructor(model: AppModel) {
    this.model = model;
  }
}

export default Controller;
