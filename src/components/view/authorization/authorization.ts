import './authorization.scss';
import AuthorizationController from '../../controller/authorizationController';
import Controller from '../../controller/controller';

export default class Authorization {
  private readonly authorizationController: AuthorizationController;

  private wrapperEl: HTMLDivElement | undefined = undefined;
  private readonly loginBtn: HTMLButtonElement = document.createElement('button');
  private readonly regBtn: HTMLButtonElement = document.createElement('button');
  private readonly loginEmailInp: HTMLInputElement = document.createElement('input');
  private readonly loginPassInp: HTMLInputElement = document.createElement('input');
  private readonly regNameInp: HTMLInputElement = document.createElement('input');
  private readonly regEmailInp: HTMLInputElement = document.createElement('input');
  private readonly regPassInp: HTMLInputElement = document.createElement('input');

  private errLoginContent: HTMLParagraphElement = document.createElement('p');
  private errRegContent: HTMLParagraphElement = document.createElement('p');

  constructor(controller: Controller) {
    this.authorizationController = controller.authorizationController;
  }

  public draw(): void {
    this.wrapperEl = document.createElement('div');
    this.wrapperEl.classList.add('authorization-wrapper');

    const authorizationEl = document.createElement('div');
    authorizationEl.classList.add('authorization');
    this.wrapperEl.append(authorizationEl);

    const tabsEl = document.createElement('div');
    tabsEl.classList.add('tabs');
    authorizationEl.append(tabsEl);

    this.loginBtn.classList.add('tab-btn');
    this.loginBtn.classList.add('active');
    this.loginBtn.innerText = 'Login';

    this.regBtn.classList.add('tab-btn');
    this.regBtn.innerText = 'Registration';
    tabsEl.append(this.loginBtn, this.regBtn);

    const loginContentEl: HTMLDivElement = document.createElement('div');
    loginContentEl.classList.add('tab-content');

    const regContentEl = document.createElement('div');
    regContentEl.classList.add('tab-content');
    regContentEl.style.display = 'none';
    authorizationEl.append(loginContentEl, regContentEl);

    this.loginEmailInp.classList.add('authorization-input');
    this.loginEmailInp.type = 'email';
    this.loginEmailInp.placeholder = 'Email';

    this.loginPassInp.classList.add('authorization-input');
    this.loginPassInp.type = 'password';
    this.loginPassInp.placeholder = 'Password';

    loginContentEl.append(this.loginEmailInp, this.loginPassInp, this.errLoginContent);

    this.regNameInp.classList.add('authorization-input');
    this.regNameInp.type = 'text';
    this.regNameInp.placeholder = 'Name';

    this.regEmailInp.classList.add('authorization-input');
    this.regEmailInp.type = 'email';
    this.regEmailInp.placeholder = 'Email';

    this.regPassInp.classList.add('authorization-input');
    this.regPassInp.type = 'password';
    this.regPassInp.placeholder = 'Password';

    regContentEl.append(this.regNameInp, this.regEmailInp, this.regPassInp, this.errRegContent);

    const signupBtn = document.createElement('button');
    signupBtn.classList.add('sign-btn');
    signupBtn.innerText = 'Sign Up';
    authorizationEl.append(signupBtn);

    this.wrapperEl.addEventListener('click', (event: Event) => {
      const target: EventTarget = event.target as HTMLElement;
      if (target === this.wrapperEl) this.clear();
    });

    this.loginBtn.addEventListener('click', () => {
      this.loginBtn.classList.add('active');
      this.regBtn.classList.remove('active');
      regContentEl.style.display = 'none';
      loginContentEl.style.display = '';
    });

    this.regBtn.addEventListener('click', () => {
      this.regBtn.classList.add('active');
      this.loginBtn.classList.remove('active');
      loginContentEl.style.display = 'none';
      regContentEl.style.display = '';
    });

    signupBtn.addEventListener('click', () => this.signIn());

    document.getElementsByTagName('body')[0].append(this.wrapperEl);
  }

  public clear(): void {
    this.wrapperEl?.remove();
    this.wrapperEl = undefined;
  }

  private validateEmail(email: string): boolean {
    const reg =
      '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/';
    return !!email.match(reg);
  }

  private async signIn(): Promise<void> {
    if (this.loginBtn.classList.contains('active')) {
      let errText = '';

      if (this.loginEmailInp.value.length === 0) {
        errText = 'Email is required field';
      } else if (this.validateEmail(this.loginEmailInp.value)) {
        errText = 'Email should have correct format';
      }

      if (this.loginPassInp.value.length < 8) {
        if (errText) errText += '\n';
        errText += 'Password is too short - should be 8 chars minimum';
      }

      if (errText) this.errLoginContent.innerText = errText;
      else {
        const loginUserData = await this.authorizationController.userSignIn(
          this.loginEmailInp.value,
          this.loginPassInp.value
        );
        if (loginUserData) {
          this.errLoginContent.innerText = loginUserData;
        } else {
          this.errLoginContent.innerText = '';
          this.clear();
        }
      }
    } else if (this.regBtn.classList.contains('active')) {
      let errText = '';

      if (this.regEmailInp.value.length === 0) {
        errText = 'Email is required field';
      } else if (this.validateEmail(this.regEmailInp.value)) {
        errText = 'Email should have correct format';
      }

      if (this.regPassInp.value.length < 8) {
        if (errText) errText += '\n';
        errText += 'Password is too short - should be 8 chars minimum';
      }

      if (errText) this.errRegContent.innerText = errText;
      else {
        const regUserData = await this.authorizationController.createUser(
          this.regNameInp.value,
          this.regEmailInp.value,
          this.regPassInp.value
        );
        if (regUserData) {
          this.errRegContent.innerText = regUserData;
        } else {
          this.errRegContent.innerText = '';
          this.clear();
        }
      }
    }
  }
}
