import Controller from '../controller/controller';
import Navigation from './navigation/navigation';

class View {
  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
    new Navigation();
  }
}

export default View;
