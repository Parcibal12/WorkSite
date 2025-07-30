import BaseHTMLElement from "../base/BaseHTMLElement.js";

class LoginSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.backendUrl = "http://localhost:3000";
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

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Login";
        }

        this.loginForm = this.shadowRoot.getElementById('loginForm');
        this.emailInput = this.shadowRoot.getElementById('email');
        this.passwordInput = this.shadowRoot.getElementById('password');
        this.messageElement = this.shadowRoot.getElementById('message');
        this.irRegisterLink = this.shadowRoot.getElementById('IrRegister');

        if (this.loginForm) {
            this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        if (this.irRegisterLink) {
            this.irRegisterLink.addEventListener('click', this.handleIrRegister.bind(this));
        }
    }

    async handleLogin(event) {
        event.preventDefault();

        this.messageElement.textContent = '';
        this.messageElement.className = 'login__message';

        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        const response = await fetch(`${this.backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            this.messageElement.textContent = data.message || 'Inicio de sesión exitoso.';
            this.messageElement.classList.add('login__message--success');
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        } else {
            this.messageElement.textContent = data.message || 'Error en el inicio de sesión.';
            this.messageElement.classList.add('login__message--error');
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

    disconnectedCallback() {
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