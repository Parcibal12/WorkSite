import '/frontend/blocks/explore/explore.js';
import '/frontend/blocks/feed/feed.js';
import '/frontend/blocks/sidebar/sidebar.js';
import '/frontend/blocks/events/events.js';
import '/frontend/blocks/register/register.js';
import '/frontend/blocks/login/login.js';
import '/frontend/blocks/jobs/jobs.js';
import '/frontend/blocks/inbox/inbox.js';
import '/frontend/blocks/employers/employers.js';
import '/frontend/blocks/event-details/event-details.js';

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
        if (addToHistory) {
            if (location.pathname !== route) {
                history.pushState({ route }, "", route);
            }
        }
        const jobsContextHeader = document.getElementById('jobs-context-nav');
        jobsContextHeader.style.display = 'none';

        const appContainer = document.getElementById('app-container');
        const isAuthRoute = route === "/login" || route === "/register";

        if (isAuthRoute) {
            appContainer.classList.add('login-mode');
        } else {
            appContainer.classList.remove('login-mode');
        }

        let pageComponent = null;
        let pageTitle = '';


        
        const eventDetailRoute = /^\/events\/([a-fA-F0-9-]+)$/;
        const match = route.match(eventDetailRoute);

        if (match) {
            const eventId = match[1];
            pageComponent = document.createElement("event-details-section");
            pageComponent.setAttribute('event-id', eventId);
            pageTitle = "";
        } else {


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
                case "/login":
                    pageComponent = document.createElement("login-section");
                    pageTitle = "Login";
                    break;
                case "/jobs":
                    pageComponent = document.createElement("jobs-section");
                    pageTitle = "Jobs";
                    jobsContextHeader.style.display = 'flex';
                    break;
                case "/inbox":
                    pageComponent = document.createElement("inbox-section");
                    pageTitle = "Inbox";
                    break;
                case "/employers":
                    pageComponent = document.createElement("employers-section");
                    pageTitle = "Employers";
                    break;

                default:
                    pageComponent = document.createElement("div");
                    pageTitle = "No Encontrado";
                    break;
            }
        }

        if (pageComponent) {
            const contentArea = document.getElementById("content-area");
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

export default Router;
