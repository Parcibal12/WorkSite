import BaseHTMLElement from "../base/BaseHTMLElement.js";

class JobsSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/jobs/jobs.template"); 
        
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/jobs/jobs.css');
        this.shadowRoot.appendChild(styleLink);

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Jobs";
        }


    }

    disconnectedCallback() {
    }
}

customElements.define("jobs-section", JobsSectionComponent);
export default JobsSectionComponent;