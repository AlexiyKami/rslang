import Controller from './controller';

export default class AuthorizationController {
  private readonly baseController: Controller;
  public token: string | null = localStorage.getItem('token');
  public refreshToken: string | null = localStorage.getItem('refreshToken');
  public userId: string | null = localStorage.getItem('userId');
  public name: string | null = localStorage.getItem('name');

  constructor(controller: Controller) {
    this.baseController = controller;
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
      this.token = userData.data.token;
      this.userId = userData.data.userId;
      this.refreshToken = userData.data.refreshToken;
      this.name = userData.data.name;

      localStorage.setItem('token', userData.data.token);
      localStorage.setItem('refreshToken', userData.data.refreshToken);
      localStorage.setItem('userId', userData.data.userId);
      localStorage.setItem('name', userData.data.name);

      return null;
    } else {
      return userData.data.toString();
    }
  }
}
