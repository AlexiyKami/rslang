import Controller from './controller';

export default class AuthorizationController {
  private readonly baseController: Controller;
  private readonly refreshTime: number = 14400000;
  public token: string | undefined;
  public refreshToken: string | undefined;
  public userId: string | undefined;
  public name: string | undefined;
  private refreshInterval: number | undefined = undefined;

  constructor(controller: Controller) {
    this.baseController = controller;
    this.token = this.baseController.model.state.token;
    this.refreshToken = this.baseController.model.state.refreshToken;
    this.userId = this.baseController.model.state.userId;
    this.name = this.baseController.model.state.userName;
    this.refresh();
    if (this.token) this.refreshInterval = window.setInterval(() => this.refresh(), this.refreshTime);
  }

  public async createUser(name: string, email: string, pass: string): Promise<string | null> {
    const createUserData = await this.baseController.api.createUser(name, email, pass);
    if (createUserData.code === 200) {
      return this.userSignIn(email, pass);
    } else {
      return createUserData.data.toString();
    }
  }

  public async userSignIn(email: string, pass: string): Promise<string | null> {
    const userData = await this.baseController.api.userSignIn(email, pass);
    if (userData.code === 200) {
      clearInterval(this.refreshInterval);

      this.token = userData.data.token;
      this.userId = userData.data.userId;
      this.refreshToken = userData.data.refreshToken;
      this.name = userData.data.name;

      this.baseController.model.state.token = userData.data.token;
      this.baseController.model.state.refreshToken = userData.data.refreshToken;
      this.baseController.model.state.userId = userData.data.userId;
      this.baseController.model.state.userName = userData.data.name;
      this.baseController.model.saveState();

      this.refreshInterval = window.setInterval(() => this.refresh(), this.refreshTime);

      return null;
    } else {
      return userData.data.toString();
    }
  }

  public signOut(): void {
    this.token = undefined;
    this.userId = undefined;
    this.refreshToken = undefined;
    this.name = undefined;

    this.baseController.model.state.token = undefined;
    this.baseController.model.state.refreshToken = undefined;
    this.baseController.model.state.userId = undefined;
    this.baseController.model.state.userName = undefined;
    this.baseController.model.saveState();

    clearInterval(this.refreshInterval);
  }

  private async refresh(): Promise<void> {
    if (this.userId && this.refreshToken) {
      const refreshData = await this.baseController.api.getUserTokens(this.userId, this.refreshToken);
      console.log(refreshData.code);
      if (refreshData.code === 200) {
        if (typeof refreshData.data !== 'string') {
          this.token = refreshData.data.token;
          this.refreshToken = refreshData.data.refreshToken;

          this.baseController.model.state.token = this.token;
          this.baseController.model.state.refreshToken = this.refreshToken;
          this.baseController.model.saveState();
          alert(this.baseController.model.state.token);
        }
      }
    }
  }
}
