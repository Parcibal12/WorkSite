import '/frontend/blocks/explore/explore.js';
import '/frontend/blocks/sidebar/sidebar.js';


const Router = {
    init: () => {
        document.body.addEventListener("navigate", (event) => {
            event.preventDefault();
            const page = event.detail.page;
            Router.go(`/${page}`);
        });

        window.addEventListener("popstate", (event) => {
            Router.go(event.state ? event.state.route : location.pathname, false);
        });

        const initialPath = location.pathname;
        if (initialPath === '/' || initialPath.endsWith('/index.html') || initialPath.endsWith('/frontend/index.html')) {
            Router.go('/explore', false);
        } else {
            Router.go(initialPath, false);
        }
    },

    go: (route, addToHistory = true) => {
        if (addToHistory) {
            history.pushState({ route }, "", route);
        }

        let pageComponent = null;
        let pageTitle = '';

        switch (route) {
            case "/explore":
                pageComponent = document.createElement("explore-section");
                pageTitle = "Explore";
                break;

            default:
                pageComponent = document.createElement("div");
                pageComponent.textContent = "Page Not Found";
                pageTitle = "Not Found";
                console.warn(`Ruta no manejada: ${route}`);
                break;
        }

        if (pageComponent) {
            const contentArea = document.getElementById("content-area");
            if (!contentArea) {
                console.error("El elemento #content-area no fue encontrado en el DOM.");
                return;
            }

            if (contentArea.children.length > 0) {
                contentArea.children[0].remove();
            }
            contentArea.appendChild(pageComponent);

            const pageTitleElement = document.getElementById("page-title");
            if (pageTitleElement) {
                pageTitleElement.textContent = pageTitle;
            } else {
                console.warn("El elemento #page-title no fue encontrado en el DOM.");
            }
        }

        window.scrollTo(0, 0);
    },
};

document.addEventListener("DOMContentLoaded", () => {
    Router.init();
});

export default Router;