import Controller from '../controller/controller';
import Dictionary from './dictionary/dictionary';

class View {
  private controller: Controller;
  private dictionary: Dictionary;

  constructor(controller: Controller) {
    this.controller = controller;
    this.dictionary = new Dictionary(this.controller);
    this.dictionary.draw();
  }
}

export default View;
