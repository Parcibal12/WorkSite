import BaseHTMLElement from "../base/BaseHTMLElement.js";
import ValidatorForm from "../../services/validators/ValidatorForm.js";
import ValidatorSignUpForm from "../../services/validators/ValidatorSignUpForm.js";
import authService from "../../services/AuthService.js";

const registerValidator = new ValidatorForm(new ValidatorSignUpForm());

class RegisterSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/register/register.template");

        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/register/register.css');
        this.shadowRoot.appendChild(styleLink);

        this.registerForm = this.shadowRoot.getElementById('registerForm');
        this.usernameInput = this.shadowRoot.getElementById('username');
        this.emailInput = this.shadowRoot.getElementById('email');
        this.passwordInput = this.shadowRoot.getElementById('password');

        this.messageElement = this.shadowRoot.getElementById('message');
        this.irLoginLink = this.shadowRoot.getElementById('IrLogin');
        
        this.logoButton = this.shadowRoot.querySelector('.register__logo-link');

        this.usernameErrorElement = this.shadowRoot.getElementById('username-error');
        this.emailErrorElement = this.shadowRoot.getElementById('email-error');
        this.passwordErrorElement = this.shadowRoot.getElementById('password-error');

        if (this.logoButton) {
            this.logoButton.addEventListener('click', this.handleLogoClick.bind(this));
        }

        if (this.registerForm) {
            this.registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        if (this.irLoginLink) {
            this.irLoginLink.addEventListener('click', this.handleIrLogin.bind(this));
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
        this.usernameInput.classList.remove('input--error');
        this.emailInput.classList.remove('input--error');
        this.passwordInput.classList.remove('input--error');

        if (this.usernameErrorElement) this.usernameErrorElement.textContent = '';
        if (this.emailErrorElement) this.emailErrorElement.textContent = '';
        if (this.passwordErrorElement) this.passwordErrorElement.textContent = '';
    }

    displayFieldErrors(errors) {
        this.clearFieldErrors();

        if (errors.username) {
            this.usernameInput.classList.add('input--error');
            if (this.usernameErrorElement) this.usernameErrorElement.textContent = errors.username;
        }
        if (errors.email) {
            this.emailInput.classList.add('input--error');
            if (this.emailErrorElement) this.emailErrorElement.textContent = errors.email;
        }
        if (errors.password) {
            this.passwordInput.classList.add('input--error');
            if (this.passwordErrorElement) this.passwordErrorElement.textContent = errors.password;
        }
    }

    async handleRegister(event) {
        event.preventDefault();

        this.messageElement.textContent = '';
        this.messageElement.className = 'register__message';
        this.clearFieldErrors();

        const username = this.usernameInput.value;
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        const formData = { username, email, password };

        const errors = registerValidator.validate(formData);

        if (errors) {
            this.displayFieldErrors(errors);
            this.showMessage('Please correct the errors', 'error');
            return;
        }

        const data = await authService.createUser({ username, email, password });

        if (data && data.generalError) {
            this.showMessage(data.generalError, 'error');
        } else if (data) {
            this.showMessage(data.message || 'Successful register', 'success');
            this.registerForm.reset();
            document.body.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'login' } }));
        } else {
            this.showMessage('Error in register', 'error');
        }
    }

    handleIrLogin(event) {
        event.preventDefault();
        document.body.dispatchEvent(new CustomEvent('navigate', {
            bubbles: true,
            composed: true,
            detail: { page: 'login' }
        }));
    }

    showMessage(message, type) {
        this.messageElement.textContent = message;
        this.messageElement.className = `register__message register__message--${type}`;
    }

    disconnectedCallback() {
        if (this.logoButton) {
            this.logoButton.removeEventListener('click', this.handleLogoClick.bind(this));
        }

        if (this.registerForm) {
            this.registerForm.removeEventListener('submit', this.handleRegister.bind(this));
        }
        if (this.irLoginLink) {
            this.irLoginLink.removeEventListener('click', this.handleIrLogin.bind(this));
        }
    }
}

customElements.define('register-section', RegisterSectionComponent);
export default RegisterSectionComponent;