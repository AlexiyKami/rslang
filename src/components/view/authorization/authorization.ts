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
    this.regBtn.classList.remove('active');
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
    this.loginEmailInp.value = '';

    this.loginPassInp.classList.add('authorization-input');
    this.loginPassInp.type = 'password';
    this.loginPassInp.placeholder = 'Password';
    this.loginPassInp.value = '';

    const authorizedUserEl = document.createElement('div');
    authorizedUserEl.classList.add('authorized-user');
    const authorizedMsgEl = document.createElement('p');
    authorizedUserEl.append(authorizedMsgEl);

    if (this.authorizationController.token) {
      authorizedMsgEl.textContent = `Authorized as ${this.authorizationController.name}`;
      loginContentEl.append(authorizedUserEl);
    } else {
      loginContentEl.append(this.loginEmailInp, this.loginPassInp, this.errLoginContent);
    }

    this.regNameInp.classList.add('authorization-input');
    this.regNameInp.type = 'text';
    this.regNameInp.placeholder = 'Name';
    this.regNameInp.value = '';

    this.regEmailInp.classList.add('authorization-input');
    this.regEmailInp.type = 'email';
    this.regEmailInp.placeholder = 'Email';
    this.regEmailInp.value = '';

    this.regPassInp.classList.add('authorization-input');
    this.regPassInp.type = 'password';
    this.regPassInp.placeholder = 'Password';
    this.regPassInp.value = '';

    regContentEl.append(this.regNameInp, this.regEmailInp, this.regPassInp, this.errRegContent);

    const signupBtn = document.createElement('button');
    signupBtn.classList.add('sign-btn', 'flat-button', 'blue');

    if (this.authorizationController.token) signupBtn.innerText = 'Sign Out';
    else signupBtn.innerText = 'Sign In';

    authorizationEl.append(signupBtn);

    this.errLoginContent.innerText = '';

    this.wrapperEl.addEventListener('mousedown', (event: Event) => {
      const target: EventTarget = event.target as HTMLElement;
      if (target === this.wrapperEl) this.clear();
    });

    this.loginBtn.addEventListener('click', () => {
      this.loginBtn.classList.add('active');
      this.regBtn.classList.remove('active');
      regContentEl.style.display = 'none';
      loginContentEl.style.display = '';
      signupBtn.innerText = 'Sign In';
      if (this.authorizationController.token) signupBtn.innerText = 'Sign Out';
    });

    this.regBtn.addEventListener('click', () => {
      this.regBtn.classList.add('active');
      this.loginBtn.classList.remove('active');
      loginContentEl.style.display = 'none';
      regContentEl.style.display = '';
      signupBtn.innerText = 'Sign Up';
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
      if (this.authorizationController.token) {
        this.authorizationController.signOut();
        this.clear();
        this.draw();
      } else {
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
            this.draw();
          }
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
          this.draw();
        }
      }
    }
  }
}
