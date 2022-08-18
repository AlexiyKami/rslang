import Controller from '../controller/controller';
import View from '../view/view';

class AppModel {
  private controller: Controller;

  private view: View;

  constructor() {
    this.controller = new Controller(this);
    this.view = new View(this.controller);
  }

  initApp() {
    this.view.initRender();
  }
}

export default AppModel;
