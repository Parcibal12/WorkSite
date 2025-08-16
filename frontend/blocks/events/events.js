import BaseHTMLElement from "../base/BaseHTMLElement.js";

const API_URL_BASE = 'http://localhost:3000';

class EventsSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.allEvents = [];
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/events/events.template");
        this.loadCSS("/frontend/blocks/events/events.css");
        await this.fetchAndRenderEvents();
        this.searchBar();
    }

    loadCSS(path) {
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', path);
        this.shadowRoot.appendChild(styleLink);
    }

    async fetchAndRenderEvents() {
        const eventsGrid = this.shadowRoot.querySelector('.events-grid');
        if (!eventsGrid) {
            return;
        }

        eventsGrid.innerHTML = `<p class="text-center text-gray-500">Loading events...</p>`;

        try {
            const response = await fetch(`${API_URL_BASE}/api/events`);
            const events = await response.json(); // La llamada a .json() debe ir aquí

            if (!response.ok || !Array.isArray(events)) {
                return;
            }

            this.allEvents = events;
            this.renderEvents(this.allEvents);
        } catch (error) {
            return;
        }
    }

    searchBar() {
        const searchInput = this.shadowRoot.querySelector('.search-bar__input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const query = event.target.value.toLowerCase();
                const filteredEvents = this.allEvents.filter(event => {
                    const title = event.title ? event.title.toLowerCase() : '';
                    const location = event.location ? event.location.toLowerCase() : '';
                    return title.includes(query) || location.includes(query);
                });
                this.renderEvents(filteredEvents);
            });
        }
    }

    renderEvents(events) {
        const eventsGrid = this.shadowRoot.querySelector('.events-grid');
        if (!eventsGrid) {
            return;
        }

        eventsGrid.innerHTML = '';

        if (events.length === 0) {
            eventsGrid.innerHTML = `<p class="text-center text-gray-500">No events available.</p>`;
        } else {
            events.forEach(event => {
                const eventCard = this.createEventCard(event);
                eventsGrid.appendChild(eventCard);
            });
        }
    }

    createEventCard(event) {
        const article = document.createElement('article');
        article.className = 'event-card';
        article.innerHTML = `
            <div class="event-card__header">
                <div class="event-card__logo-placeholder"></div>
                <h3 class="event-card__company">${event.institution_name || 'Organizer'}</h3>
                <button class="event-card__bookmark">
                    <img src="/frontend/assets/icons/bookmark_filled.svg" alt="Bookmark icon" class="event-card__bookmark-icon">
                </button>
            </div>
            <p class="event-card__date">${event.title}</p>
            <p class="event-card__time">${new Date(event.date).toLocaleDateString()} - ${event.location}</p>
            <hr class="event-card__separator">
            <p class="event-card__attendees">${event.registered_count} students registered</p>
        `;
        return article;
    }

    disconnectedCallback() {
    }
}

customElements.define('events-section', EventsSectionComponent);
export default EventsSectionComponent;
