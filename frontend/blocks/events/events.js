import BaseHTMLElement from "../base/BaseHTMLElement.js";

class EventsSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/events/events.template"); 
        
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/events/events.css');
        this.shadowRoot.appendChild(styleLink);

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Events";
        }

    }

    disconnectedCallback() {
    }

}

customElements.define("events-section", EventsSectionComponent);
export default EventsSectionComponent;