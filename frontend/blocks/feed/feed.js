import BaseHTMLElement from "../base/BaseHTMLElement.js";
class FeedSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        this.init(); 
    }

    async init() {
        await this.loadHTML("/frontend/blocks/feed/feed.template"); 
        
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/feed/feed.css');
        this.shadowRoot.appendChild(styleLink);

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Feed";
        }

    }

    disconnectedCallback() {
    }


}

customElements.define('feed-section', FeedSectionComponent);
export default FeedSectionComponent;