import Controller from '../controller/controller';
import Dictionary from './dictionary/dictionary';
import Navigation from './navigation/navigation';

class View {
  private controller: Controller;

  private dictionary: Dictionary;

  private navigation: Navigation;

  constructor(controller: Controller) {
    this.controller = controller;
    this.navigation = new Navigation();
    this.dictionary = new Dictionary(this.controller);
  }

  public initRender() {
    this.dictionary.draw();
  }
}

export default View;
