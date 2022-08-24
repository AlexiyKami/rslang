import Controller from './controller';

export default class NavController {
  private readonly baseController: Controller;
  private _curPage: number;

  constructor(controller: Controller) {
    this.baseController = controller;
    this._curPage = this.baseController.model.state.curPage || 0;
  }

  set curPage(value: number) {
    this._curPage = value;
    this.baseController.model.state.curPage = value;
    this.baseController.model.saveState();
    this.baseController.model.view.navigation.setCurPage(value);
  }

  get curPage() {
    return this._curPage;
  }
}
