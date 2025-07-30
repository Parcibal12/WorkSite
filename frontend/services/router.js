import '/frontend/blocks/explore/explore.js';
import '/frontend/blocks/feed/feed.js';
import '/frontend/blocks/sidebar/sidebar.js';
import '/frontend/blocks/events/events.js';
import '/frontend/blocks/register/register.js';


const Router = {
    init: () => {
        document.body.addEventListener("navigate", (event) => {
            const page = event.detail.page;
            Router.go(`/${page}`);
        });

        window.addEventListener("popstate", (event) => {
            if (event.state && event.state.route) {
                Router.go(event.state.route, false);
            }
        });

        const initialPath = location.pathname;
        if (initialPath === '/' || initialPath.endsWith('/index.html')) {
            Router.go('/explore');
        } else {
            Router.go(initialPath);
        }
    },

    go: (route, addToHistory = true) => {
        console.log(`Navegando a: ${route}`);

        if (addToHistory) {
            if (location.pathname !== route) {
                history.pushState({ route }, "", route);
            }
        }

        let pageComponent = null;
        let pageTitle = '';

        switch (route) {
            case "/explore":
                pageComponent = document.createElement("explore-section");
                pageTitle = "Explore";
                break;

            case "/feed":
                pageComponent = document.createElement("feed-section");
                pageTitle = "Feed";
                break;
            case "/events":
                pageComponent = document.createElement("events-section");
                pageTitle = "Events";
                break;
            case "/register":
                pageComponent = document.createElement("register-section");
                pageTitle = "Register";
                break;



            default:
                pageComponent = document.createElement("div");
                pageTitle = "No Encontrado";
                console.warn(`Ruta no manejada: ${route}`);
                break;
        }

        if (pageComponent) {
            const contentArea = document.getElementById("content-area");
            if (!contentArea) {
                return;
            }

            contentArea.innerHTML = '';
            contentArea.appendChild(pageComponent);

            const pageTitleElement = document.getElementById("page-title");
            if (pageTitleElement) {
                pageTitleElement.textContent = pageTitle;
            }
        }

        window.scrollTo(0, 0);
    },
};

document.addEventListener("DOMContentLoaded", () => {
    Router.init();
});

export default Router;