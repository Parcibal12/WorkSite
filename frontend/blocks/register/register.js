import BaseHTMLElement from "../base/BaseHTMLElement.js";
class RegisterSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.init();
    }

    async init(){
        await this.loadHTML("/frontend/blocks/register/register.template");

        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/register/register.css');
        this.shadowRoot.appendChild(styleLink);

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Register";
        }
    }

    disconnectedCallback() {
    }
}

customElements.define('register-section', RegisterSectionComponent);
export default RegisterSectionComponent;