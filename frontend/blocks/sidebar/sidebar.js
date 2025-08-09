import BaseHTMLElement from "../base/BaseHTMLElement.js";

class SidebarComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/sidebar/sidebar.template");
        
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/sidebar/sidebar.css');
        this.shadowRoot.appendChild(styleLink);

        this.setupEventListeners();
        this.setActiveItemFromUrl();
    }

    setupEventListeners() {
        const logoButton = this.shadowRoot.querySelector('.sidebar-header');
        if (logoButton) {
            logoButton.addEventListener('click', () => {
                document.body.dispatchEvent(
                    new CustomEvent('navigate', {
                        detail: { page: 'explore' }
                    })
                );
                this.setActiveItemFromUrl();
            });

            logoButton.style.cursor = 'pointer';
        }

        const navLinks = this.shadowRoot.querySelectorAll('.nav-menu__link');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();

                this.handleNavigationClick(link);

                const fullRoute = link.getAttribute('href');
                const page = fullRoute.substring(1);

                document.body.dispatchEvent(
                    new CustomEvent('navigate', {
                        detail: { page: page }
                    })
                );
            });
        });
    }

    handleNavigationClick(clickedLink) {
        const navItems = this.shadowRoot.querySelectorAll('.nav-menu__item');
        
        navItems.forEach(item => {
            item.classList.remove('nav-menu__item--active');
        });

        const parentListItem = clickedLink.parentElement;
        if (parentListItem) {
            parentListItem.classList.add('nav-menu__item--active');
        }
    }

    setActiveItemFromUrl() {
        const currentPath = window.location.pathname;
        const activeRoute = (currentPath === '/' || currentPath.endsWith('/index.html')) ? '/explore' : currentPath;

        const activeLink = this.shadowRoot.querySelector(`.nav-menu__link[href="${activeRoute}"]`);
        if (activeLink) {
            this.handleNavigationClick(activeLink);
        } else {
            const baseRoute = activeRoute.split('/')[1];
            const baseActiveLink = this.shadowRoot.querySelector(`.nav-menu__link[href="/${baseRoute}"]`);
            if (baseActiveLink) {
                this.handleNavigationClick(baseActiveLink);
            }
        }
    }

    disconnectedCallback() {
    }
}

customElements.define('sidebar-component', SidebarComponent);

export default SidebarComponent;