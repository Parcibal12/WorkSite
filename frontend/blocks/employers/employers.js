import BaseHTMLElement from "../base/BaseHTMLElement.js";

class EmployersSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.init();
    }

    async init () {
        await this.loadHTML("/frontend/blocks/employers/employers.template"); 

        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/employers/employers.css');
        this.shadowRoot.appendChild(styleLink);

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Employers";
        }

    }

    disconnectedCallback() {

    }
}

customElements.define("employers-section", EmployersSectionComponent);
export default EmployersSectionComponent;


