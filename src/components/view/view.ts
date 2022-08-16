import Controller from '../controller/controller';

class View {
  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }
}

export default View;
