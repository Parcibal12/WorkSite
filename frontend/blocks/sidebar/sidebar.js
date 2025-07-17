const sidebarTemplate = document.createElement('template');
sidebarTemplate.innerHTML = `
    <link rel="stylesheet" href="/frontend/blocks/sidebar/sidebar.css">

    <div class="sidebar">
        <div class="sidebar-header">
            <img class="sidebar__logo-img" src="/frontend/assets/logo.png" alt="Logo">
        </div>

        <div class="sidebar__section">
            <ul class="nav-menu">
                <li class="nav-menu__item nav-menu__item--active">
                    <a href="#" class="nav-menu__link">
                        <span class="nav-menu__icon nav-menu__icon--explore"></span>
                        <span class="nav-menu__text">Explore</span>
                    </a>
                </li>
                <li class="nav-menu__item">
                    <a href="#" class="nav-menu__link">
                        <span class="nav-menu__icon nav-menu__icon--feed"></span>
                        <span class="nav-menu__text">Feed</span>
                    </a>
                </li>
                <li class="nav-menu__item">
                    <a href="#" class="nav-menu__link">
                        <span class="nav-menu__icon nav-menu__icon--inbox"></span>
                        <span class="nav-menu__text">Inbox</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="sidebar__section">
            <ul class="nav-menu">
                <li class="nav-menu__item">
                    <a href="#" class="nav-menu__link">
                        <span class="nav-menu__icon nav-menu__icon--jobs"></span>
                        <span class="nav-menu__text">Jobs</span>
                    </a>
                </li>
                <li class="nav-menu__item">
                    <a href="#" class="nav-menu__link">
                        <span class="nav-menu__icon nav-menu__icon--events"></span>
                        <span class="nav-menu__text">Events</span>
                    </a>
                </li>
                <li class="nav-menu__item">
                    <a href="#" class="nav-menu__link">
                        <span class="nav-menu__icon nav-menu__icon--employers"></span>
                        <span class="nav-menu__text">Employers</span>
                    </a>
            </ul>
        </div>
    </div>
`;

class SidebarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(sidebarTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const navItems = this.shadowRoot.querySelectorAll('.nav-menu__link');
        navItems.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                this.handleNavigationClick(item);
            });
        });
    }

    handleNavigationClick(clickedItem) {
        const navItems = this.shadowRoot.querySelectorAll('.nav-menu__item');
        navItems.forEach(item => {
            item.classList.remove('nav-menu__item--active');
        });

        clickedItem.classList.add('nav-menu__item--active');

        const linkText = clickedItem.querySelector('.nav-menu__text').textContent;
        this.dispatchEvent(new CustomEvent('navigate', {
            bubbles: true,
            composed: true,
            detail: { page: linkText.toLowerCase() }
        }));
    }

}

customElements.define('sidebar-component', SidebarComponent);
