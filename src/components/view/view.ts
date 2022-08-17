import Controller from '../controller/controller';
import Dictionary from './dictionary/dictionary';
import Navigation from './navigation/navigation';

class View {
  private controller: Controller;
  private dictionary: Dictionary;

  constructor(controller: Controller) {
    this.controller = controller;
    this.dictionary = new Dictionary(this.controller);
    this.dictionary.draw();
    new Navigation();
  }
}

export default View;
