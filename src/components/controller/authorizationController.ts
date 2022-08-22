import Controller from './controller';

export default class AuthorizationController {
  private readonly baseController: Controller;
  public token: string | undefined = undefined;
  public refreshToken: string | undefined = undefined;
  public userId: string | undefined = undefined;
  public name: string | undefined = undefined;

  constructor(controller: Controller) {
    this.baseController = controller;
  }

  public async createUser(name: string, email: string, pass: string): Promise<string | undefined> {
    const createUserData = await this.baseController.api.createUser(name, email, pass);
    if (createUserData.code === 200) {
      return this.userSignIn(email, pass);
    } else {
      return createUserData.data.toString();
    }
  }

  public async userSignIn(email: string, pass: string): Promise<string | undefined> {
    const userData = await this.baseController.api.userSignIn(email, pass);
    if (userData.code === 200) {
      this.token = userData.data.token;
      this.userId = userData.data.userId;
      this.refreshToken = userData.data.refreshToken;
      this.name = userData.data.name;
      return undefined;
    } else {
      return userData.data.toString();
    }
  }
}
