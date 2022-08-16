import AppModel from '../app/app';
import View from '../view/view';

class Controller {
  constructor(private readonly model: AppModel, private readonly view: View) {}
}

export default Controller;
