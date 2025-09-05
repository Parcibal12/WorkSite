import BaseHTMLElement from "../base/BaseHTMLElement.js";
import MyApi from '../../services/api/MyApi.js';
import authService from '../../services/AuthService.js';
import {
    DataCommandExecutor,
    DATA_COMMAND,
    Command
} from '../../services/command/DataCommand.js';

class EventDetailsSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.eventId = null;
        this.eventData = null;
        this.isSaved = false;
        this.elements = {};
    }

    connectedCallback() {
        this.eventId = this.getAttribute('event-id');
        if (this.eventId) {
            this.init();
        }
    }

    async init() {
        await this.loadHTML("/frontend/blocks/event-details/event-details.template");
        this.loadCSS("/frontend/blocks/event-details/event-details.css");
        this.cacheDOMElements();
        await this.fetchEventDetails();
        await this.checkSavedState();
        this.renderEventDetails();
        this.setupEventListeners();
    }

    loadCSS(path) {
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', path);
        this.shadowRoot.appendChild(styleLink);
    }
    
    cacheDOMElements() {
        this.shadowRoot.querySelectorAll('[data-element]').forEach(el => {
            this.elements[el.dataset.element] = el;
        });
    }

    async fetchEventDetails() {
        try {
            this.eventData = await MyApi.getEventById(this.eventId);
        } catch (error) {
            console.error('Failed to fetch event details:', error);
            this.shadowRoot.innerHTML = `<p class="event-detail__error">error loading event details</p>`;
        }
    }

    async checkSavedState() {
        if (authService.isLoggedIn()) {
            const savedEventIds = await MyApi.getSavedEventIds();
            this.isSaved = savedEventIds.includes(String(this.eventId));
        }
    }

    renderEventDetails() {
        if (!this.eventData) return;
        
        const {
            title,
            subtitle,
            logo,
            'employer-name': employerName,
            date,
            'date-relative': dateRelative,
            'location-type': locationType,
            'location-city': locationCity,
            'full-datetime': fullDatetime,
            description
        } = this.elements;

        if (title) title.textContent = this.eventData.title || 'Event Title';
        if (subtitle) subtitle.textContent = this.eventData.title || 'Event Details';
        if (logo) logo.src = this.eventData.institution_logo || '/frontend/assets/icons/Image.svg';
        if (employerName) employerName.textContent = this.eventData.institution_name || 'Employer Name';
        
        const eventDate = new Date(this.eventData.date);
        if (date) date.textContent = this.formatDate(eventDate);
        if (dateRelative) dateRelative.textContent = this.getRelativeDate(eventDate);

        if (locationType) locationType.textContent = this.eventData.location_type || 'In Person';
        if (locationCity) locationCity.textContent = this.eventData.location || 'No location specified';

        if (fullDatetime) fullDatetime.textContent = this.formatFullDateTime(eventDate);
        if (description) description.textContent = this.eventData.description || 'No description available.';

        this.updateSaveButtonState();
    }

    setupEventListeners() {
        if (this.elements['save-button']) {
            this.elements['save-button'].addEventListener('click', () => this.toggleSaveState());
        }
        if (this.elements['register-button']) {
            this.elements['register-button'].addEventListener('click', () => this.registerForEvent());
        }
    }

    toggleSaveState() {
        if (!authService.isLoggedIn()) {
            alert("Please log in to save events.");
            return;
        }

        this.isSaved = !this.isSaved;
        this.updateSaveButtonState();

        const action = this.isSaved ? DATA_COMMAND.SAVE_EVENT : DATA_COMMAND.UNSAVE_EVENT;
        const command = new Command(action, { itemId: this.eventId });
        const executor = new DataCommandExecutor(MyApi);
        executor.execute(command).catch(error => {
            console.error(`Failed to ${action}:`, error);
            this.isSaved = !this.isSaved;
            this.updateSaveButtonState();
        });
    }

    updateSaveButtonState() {
        const { 'save-button': saveButton, 'save-button-text': saveButtonText } = this.elements;
        if (saveButton && saveButtonText) {
            saveButtonText.textContent = this.isSaved ? "Saved" : "Save";
            saveButton.classList.toggle('is-saved', this.isSaved);
        }
    }
    
    async registerForEvent() {
        if (!authService.isLoggedIn()) {
            alert("Please log in to register for events.");
            return;
        }
        try {
            await MyApi.registerForEvent(this.eventId);
            alert('Successfully registered for the event');
        } catch (error) {
            console.error('Registration failed:', error);
            alert(error.message || 'Failed to register for the event');
        }
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    formatFullDateTime(date) {
        const datePart = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${datePart} · ${timePart} - 5:00 PM`; 
    }

    getRelativeDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDay = new Date(date);
        eventDay.setHours(0, 0, 0, 0);

        const diffTime = eventDay.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return "Event has passed";
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        return `In ${diffDays} days`;
    }
}

customElements.define("event-details-section", EventDetailsSectionComponent);
export default EventDetailsSectionComponent;