import BaseHTMLElement from "../base/BaseHTMLElement.js";
import ValidatorForm from "../../services/validators/ValidatorForm.js";
import ValidatorLoginForm from "../../services/validators/ValidatorLoginForm.js";
import authService from "../../services/AuthService.js";

const loginValidator = new ValidatorForm(new ValidatorLoginForm());

class LoginSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/login/login.template");

        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/login/login.css');
        this.shadowRoot.appendChild(styleLink);

        this.loginForm = this.shadowRoot.getElementById('loginForm');
        this.emailInput = this.shadowRoot.getElementById('email');
        this.passwordInput = this.shadowRoot.getElementById('password');
        this.messageElement = this.shadowRoot.getElementById('message');
        this.irRegisterLink = this.shadowRoot.getElementById('IrRegister');

        this.logoButton = this.shadowRoot.querySelector('.login__logo-link');

        this.emailErrorElement = this.shadowRoot.getElementById('email-error');
        this.passwordErrorElement = this.shadowRoot.getElementById('password-error');


        if (this.logoButton) {
            this.logoButton.addEventListener('click', this.handleLogoClick.bind(this));
        }
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        if (this.irRegisterLink) {
            this.irRegisterLink.addEventListener('click', this.handleIrRegister.bind(this));
        }
    }

    handleLogoClick(event) {
        event.preventDefault();
        document.body.dispatchEvent(new CustomEvent('navigate', {
            bubbles: true,
            composed: true,
            detail: { page: 'explore' }
        }));
    }

    clearFieldErrors() {
        this.emailInput.classList.remove('input--error');
        this.passwordInput.classList.remove('input--error');

        if (this.emailErrorElement) this.emailErrorElement.textContent = '';
        if (this.passwordErrorElement) this.passwordErrorElement.textContent = '';
    }

    displayFieldErrors(errors) {
        this.clearFieldErrors();

        if (errors.email) {
            this.emailInput.classList.add('input--error');
            if (this.emailErrorElement) this.emailErrorElement.textContent = errors.email;
        }
        if (errors.password) {
            this.passwordInput.classList.add('input--error');
            if (this.passwordErrorElement) this.passwordErrorElement.textContent = errors.password;
        }
    }

    async handleLogin(event) {
        event.preventDefault();

        this.messageElement.textContent = '';
        this.messageElement.className = 'login__message';
        this.clearFieldErrors();

        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        const formData = { email, password };

        const errors = loginValidator.validate(formData);

        if (errors) {
            this.displayFieldErrors(errors);
            this.showMessage('Please correct the errors', 'error');
            return;
        }

        const data = await authService.login({ email, password });

        if (data && data.generalError) {
            this.showMessage(data.generalError, 'error');
        } else if (data) {
            this.showMessage(data.message || 'Successful Login', 'success');
            document.body.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'explore' } }));
        } else {
            this.showMessage('Error in Login', 'error');
        }
    }

    handleIrRegister(event) {
        event.preventDefault();
        document.body.dispatchEvent(new CustomEvent('navigate', {
            bubbles: true,
            composed: true,
            detail: { page: 'register' }
        }));
    }

    showMessage(message, type) {
        this.messageElement.textContent = message;
        this.messageElement.className = `login__message login__message--${type}`;
    }

    disconnectedCallback() {
        if (this.logoButton) {
            this.logoButton.removeEventListener('click', this.handleLogoClick.bind(this));
        }
        if (this.loginForm) {
            this.loginForm.removeEventListener('submit', this.handleLogin.bind(this));
        }
        if (this.irRegisterLink) {
            this.irRegisterLink.removeEventListener('click', this.handleIrRegister.bind(this));
        }
    }
}

customElements.define('login-section', LoginSectionComponent);
export default LoginSectionComponent;
