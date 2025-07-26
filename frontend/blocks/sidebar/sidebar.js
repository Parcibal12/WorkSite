const sidebarTemplate = document.createElement('template');
sidebarTemplate.innerHTML = `
    <link rel="stylesheet" href="/frontend/blocks/sidebar/sidebar.css">

    <div class="sidebar">
        <div class="sidebar-header">
            <img class="sidebar__logo-img" src="/frontend/assets/logo.png" alt="Logo">
        </div>

        <div class="sidebar__section">
            <ul class="nav-menu">
                <li class="nav-menu__item">
                    <a href="/explore" class="nav-menu__link"> <span class="nav-menu__icon nav-menu__icon--explore"></span>
                        <span class="nav-menu__text">Explore</span>
                    </a>
                </li>
                <li class="nav-menu__item">
                    <a href="/feed" class="nav-menu__link"> <span class="nav-menu__icon nav-menu__icon--feed"></span>
                        <span class="nav-menu__text">Feed</span>
                    </a>
                </li>
                <li class="nav-menu__item">
                    <a href="/inbox" class="nav-menu__link"> <span class="nav-menu__icon nav-menu__icon--inbox"></span>
                        <span class="nav-menu__text">Inbox</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="sidebar__section">
            <ul class="nav-menu">
                <li class="nav-menu__item">
                    <a href="/jobs" class="nav-menu__link"> <span class="nav-menu__icon nav-menu__icon--jobs"></span>
                        <span class="nav-menu__text">Jobs</span>
                    </a>
                </li>
                <li class="nav-menu__item">
                    <a href="/events" class="nav-menu__link"> <span class="nav-menu__icon nav-menu__icon--events"></span>
                        <span class="nav-menu__text">Events</span>
                    </a>
                </li>
                <li class="nav-menu__item">
                    <a href="/employers" class="nav-menu__link"> <span class="nav-menu__icon nav-menu__icon--employers"></span>
                        <span class="nav-menu__text">Employers</span>
                    </a>
                </li>
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
        this.setActiveItemFromUrl();
    }

    setupEventListeners() {
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
}

customElements.define('sidebar-component', SidebarComponent);