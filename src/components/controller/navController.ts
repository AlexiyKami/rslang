import Controller from './controller';

export default class NavController {
  private readonly baseController: Controller;
  private _curPage: number;

  constructor(controller: Controller) {
    this.baseController = controller;
    this._curPage = this.baseController.model.state.curPage || 0;
  }

  set curPage(value: number) {
    let correctValue = value;
    if (!this.baseController.isAuthorized() && value === 2) correctValue = 1;
    this._curPage = correctValue;
    this.baseController.model.state.curPage = correctValue;
    this.baseController.model.saveState();
    this.baseController.model.view.navigation.setCurPage(correctValue);
  }

  get curPage() {
    return this._curPage;
  }
}
