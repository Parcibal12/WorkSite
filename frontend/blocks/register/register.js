import BaseHTMLElement from "../base/BaseHTMLElement.js";

class RegisterSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.backendUrl = "http://localhost:3000";
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

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Register";
        }

        this.registerForm = this.shadowRoot.getElementById('registerForm');
        this.usernameInput = this.shadowRoot.getElementById('username');
        this.emailInput = this.shadowRoot.getElementById('email');
        this.passwordInput = this.shadowRoot.getElementById('password');
        this.messageElement = this.shadowRoot.getElementById('message');

        if (this.registerForm) {
            this.registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }
    }

    async handleRegister(event) {
        event.preventDefault();

        this.messageElement.textContent = '';
        this.messageElement.className = 'register__message';

        const username = this.usernameInput.value;
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        // Aquí ya no hay try...catch para errores de red
        const response = await fetch(`${this.backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            this.messageElement.textContent = data.message || 'Registro exitoso.';
            this.messageElement.classList.add('register__message--success');
            this.registerForm.reset();
        } else {
            this.messageElement.textContent = data.message || 'Error en el registro.';
            this.messageElement.classList.add('register__message--error');
        }
    }

    disconnectedCallback() {
        if (this.registerForm) {
            this.registerForm.removeEventListener('submit', this.handleRegister.bind(this));
        }
    }
}

customElements.define('register-section', RegisterSectionComponent);
export default RegisterSectionComponent;