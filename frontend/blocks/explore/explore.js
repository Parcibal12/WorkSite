import BaseHTMLElement from "../base/BaseHTMLElement.js";

class ExploreSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.init(); 
    }

    async init() {
        await this.loadHTML("/frontend/blocks/explore/explore.template"); 
        
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/explore/explore.css');
        this.shadowRoot.appendChild(styleLink);

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Explore";
        }


    }

    disconnectedCallback() {

    }


}

customElements.define('explore-section', ExploreSectionComponent);
export default ExploreSectionComponent;