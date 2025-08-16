import BaseHTMLElement from "../base/BaseHTMLElement.js";

const API_URL_BASE = 'http://localhost:3000';

class EmployersSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.allEmployers = [];
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/employers/employers.template");
        this.loadCSS("/frontend/blocks/employers/employers.css");
        await this.fetchAndRenderEmployers();
        this.searchBar();
    }

    loadCSS(path) {
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', path);
        this.shadowRoot.appendChild(styleLink);
    }
    
    async fetchAndRenderEmployers() {
        const employersList = this.shadowRoot.querySelector('.employers-template__list');
        if (!employersList) {
            return;
        }

        employersList.innerHTML = `<li class="text-center text-gray-500">Loading employers...</li>`;

        try {
            const response = await fetch(`${API_URL_BASE}/api/institutions`);
            const employers = await response.json();

            if (!response.ok || !Array.isArray(employers)) {
                return;
            }
            
            this.allEmployers = employers;
            this.renderEmployers(this.allEmployers);

        } catch (error) {
            return;
        }
    }
    
    searchBar() {
        const searchInput = this.shadowRoot.querySelector('.employers-template__search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const query = event.target.value.toLowerCase();
                const filteredEmployers = this.allEmployers.filter(employer => {
                    const description = employer.description ? employer.description.toLowerCase() : '';
                    return employer.name.toLowerCase().includes(query) || 
                           description.includes(query);
                });
                this.renderEmployers(filteredEmployers);
            });
        }
    }

    renderEmployers(employers) {
        const employersList = this.shadowRoot.querySelector('.employers-template__list');
        if (!employersList) {
            return;
        }

        employersList.innerHTML = '';
        if (employers.length === 0) {
            employersList.innerHTML = `<li class="text-center text-gray-500">No employers available.</li>`;
        } else {
            employers.forEach((employer, index) => {
                const employerListItem = this.createEmployerListItem(employer);
                employersList.appendChild(employerListItem);
                
                if (index < employers.length - 1) {
                    const separator = document.createElement('hr');
                    separator.className = 'employers-template__separator';
                    employersList.appendChild(separator);
                }
            });
        }
    }

    createEmployerListItem(employer) {
        const listItem = document.createElement('li');
        listItem.className = 'employers-template__list-item';
        
        listItem.innerHTML = `
            <div class="employers-template__content">
                <h4 class="employers-template__company-name">${employer.name}</h4>
                <p class="employers-template__job-description">${employer.description}</p>
            </div>
            <button class="employers-template__follow-button">
                Follow
            </button>
        `;
        return listItem;
    }

    disconnectedCallback() {
    }
}

customElements.define("employers-section", EmployersSectionComponent);
export default EmployersSectionComponent;