import BaseHTMLElement from "../base/BaseHTMLElement.js";
import { DataCommandExecutor, DATA_COMMAND, Command } from '../../services/command/DataCommand.js';
import MyApi from '../../services/api/MyApi.js';
import authService from '../../services/AuthService.js';

const API_URL_BASE = 'http://localhost:3000';

class EventsSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.allEvents = [];
        this.savedEvents = new Set();
        this.currentView = 'all';
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/events/events.template");
        this.loadCSS("/frontend/blocks/events/events.css");

        if (authService.isLoggedIn()) {
            const savedEventIds = await MyApi.getSavedEventIds();
            this.savedEvents = new Set(savedEventIds);
        }

        this.updateSavedCounter();
        this.setupFilterListeners();
        await this.fetchAndRenderEvents();
        this.searchBar();
    }

    loadCSS(path) {
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', path);
        this.shadowRoot.appendChild(styleLink);
    }

    setupFilterListeners() {
        const savedFilterButton = this.shadowRoot.getElementById('saved-filter-button');
        if (savedFilterButton) {
            savedFilterButton.addEventListener('click', () => this.toggleSavedView());
        }
    }

    toggleSavedView() {
        const savedFilterButton = this.shadowRoot.getElementById('saved-filter-button');
        if (this.currentView === 'all') {
            this.currentView = 'saved';
            savedFilterButton.classList.add('active');
            this.showSavedEventsView();
        } else {
            this.currentView = 'all';
            savedFilterButton.classList.remove('active');
            this.showAllEventsView();
        }
    }

    async showSavedEventsView() {
        const eventsGrid = this.shadowRoot.querySelector('.events-grid');
        const subtitle = this.shadowRoot.querySelector('.events-section__subtitle');
        subtitle.textContent = 'Saved Events';
        eventsGrid.innerHTML = `<p class="text-center text-gray-500">Loading saved events...</p>`;

        try {
            const savedEventsList = await MyApi.getSavedEventsDetails();
            this.renderEvents(savedEventsList);
        } catch (error) {
            eventsGrid.innerHTML = `<p class="text-center text-gray-500">Could not load saved events.</p>`;
        }
    }

    showAllEventsView() {
        const subtitle = this.shadowRoot.querySelector('.events-section__subtitle');
        subtitle.textContent = 'All Events';
        this.renderEvents(this.allEvents);
    }

    updateSavedCounter() {
        const counter = this.shadowRoot.getElementById('saved-events-counter');
        if (counter) {
            counter.textContent = this.savedEvents.size;
        }
    }

    async fetchAndRenderEvents() {
        const eventsGrid = this.shadowRoot.querySelector('.events-grid');
        eventsGrid.innerHTML = `<p class="text-center text-gray-500">Loading events...</p>`;

        try {
            const response = await fetch(`${API_URL_BASE}/api/events`);
            const events = await response.json();
            if (!response.ok) throw new Error("Failed to fetch events");

            this.allEvents = events;
            
            if (this.currentView === 'all') {
                this.renderEvents(this.allEvents);
            }
        } catch (error) {
            eventsGrid.innerHTML = `<p class="text-center text-gray-500">Failed to load events.</p>`;
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
        if (!eventsGrid) return;

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
        article.dataset.eventId = event.id;
        
        const isSaved = this.savedEvents.has(event.id);
        const isSavedClass = isSaved ? 'is-saved' : '';

        article.innerHTML = `
            <div class="event-card__header">
                <img class="event-card__logo" src="${event.institution_logo || 'https://placehold.co/40x40/000000/FFFFFF?text=L'}" alt="${event.institution_name || 'Logo'}">
                <h3 class="event-card__company">${event.institution_name || 'Organizer'}</h3>
                <button class="event-card__bookmark ${isSavedClass}" data-event-id="${event.id}">
                    <img src="/frontend/assets/icons/bookmark_filled.svg" alt="Bookmark icon" class="event-card__bookmark-icon">
                </button>
            </div>
            <p class="event-card__date">${event.title}</p>
            <p class="event-card__time">${new Date(event.date).toLocaleDateString()} - ${event.location}</p>
            <hr class="event-card__separator">
            <p class="event-card__attendees">${event.registered_count} students registered</p>
        `;

        const saveButton = article.querySelector('.event-card__bookmark');
        saveButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!authService.isLoggedIn()) return;

            const eventId = event.id;
            const isCurrentlySaved = this.savedEvents.has(eventId);
            const action = isCurrentlySaved ? DATA_COMMAND.UNSAVE_EVENT : DATA_COMMAND.SAVE_EVENT;

            if (isCurrentlySaved) {
                this.savedEvents.delete(eventId);
                saveButton.classList.remove('is-saved');
            } else {
                this.savedEvents.add(eventId);
                saveButton.classList.add('is-saved');
            }
            
            this.updateSavedCounter();

            if (this.currentView === 'saved' && isCurrentlySaved) {
                article.remove();
            }

            const command = new Command(action, { itemId: eventId });
            const executor = new DataCommandExecutor(MyApi);
            executor.execute(command);
        });

        article.addEventListener('click', (e) => {
            e.stopPropagation();
            const eventId = e.currentTarget.dataset.eventId;
            document.body.dispatchEvent(new CustomEvent('navigate', {
                bubbles: true,
                composed: true,
                detail: { page: `events/${eventId}` }
            }));
        });

        return article;
    }

    disconnectedCallback() {}
}

customElements.define('events-section', EventsSectionComponent);
export default EventsSectionComponent;