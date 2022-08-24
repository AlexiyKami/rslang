import Controller from '../../controller/controller';
import './loadingPopup.scss';
class LoadingPopup {
  baseController: Controller;

  constructor(controller: Controller) {
    this.baseController = controller;
    controller.onLoadingPopup = [this.draw.bind(this), this.clear.bind(this)];
  }

  public draw(): void {
    const wrapper = `
    <div class='loading-background'>
      <div class='spinner'></div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', wrapper);
  }

  public clear(): void {
    document.querySelector('.loading-background')?.remove();
  }
}

export default LoadingPopup;
