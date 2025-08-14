import BaseHTMLElement from "../base/BaseHTMLElement.js";

const API_URL_BASE = 'http://localhost:3000';

class EventsSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/events/events.template");
        this.loadCSS("/frontend/blocks/events/events.css");
        this.fetchAndRenderEvents();
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
            
            if (!response.ok) {
                return;
            }

            const events = await response.json();

            if (!Array.isArray(events)) {
                return;
            }

            eventsGrid.innerHTML = '';
            
            if (events.length > 0) {
                events.forEach(event => {
                    const eventCard = this.createEventCard(event);
                    eventsGrid.appendChild(eventCard);
                });
            }

        } catch (error) {
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
}

customElements.define('events-section', EventsSectionComponent);
export default EventsSectionComponent;
