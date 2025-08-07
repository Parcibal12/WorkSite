import BaseHTMLElement from "../base/BaseHTMLElement.js";

class InboxSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow( { mode: 'open'} );
    }

    connectedCallback() {
        this.init();
    }

    async init(){
        await this.loadHTML("/frontend/blocks/inbox/inbox.template");

        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/inbox/inbox.css');
        this.shadowRoot.appendChild(styleLink);

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Inbox";

        }

    }

    disconnectedCallback(){

    }
}

customElements.define("inbox-section", InboxSectionComponent);
export default InboxSectionComponent;
