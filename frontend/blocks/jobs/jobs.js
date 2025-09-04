import BaseHTMLElement from "../base/BaseHTMLElement.js";
import { DataCommandExecutor, DATA_COMMAND, Command } from '../../services/command/DataCommand.js';
import MyApi from '../../services/api/MyApi.js';
import authService from '../../services/AuthService.js';

const API_URL_BASE = 'http://localhost:3000';

class JobsSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.allJobs = [];
        this.savedJobs = new Set();
        this.currentView = 'search';
        this.activeJobId = null;

        this.handleSearchTabClick = this.handleSearchTabClick.bind(this);
        this.handleSavedTabClick = this.handleSavedTabClick.bind(this);
    }



    connectedCallback() {
        this.mainContentContainer = document.getElementById('main-content-container');
        if (this.mainContentContainer) {
            this.originalOverflowY = this.mainContentContainer.style.overflowY;
            this.originalPadding = this.mainContentContainer.style.padding;

            this.mainContentContainer.style.overflowY = 'hidden';
            this.mainContentContainer.style.padding = '0';
            this.mainContentContainer.scrollTop = 0;
        }

        this.init();
        this.setupHeaderTabs();
    }

    disconnectedCallback() {
        if (this.mainContentContainer) {
            this.mainContentContainer.style.overflowY = this.originalOverflowY;
            this.mainContentContainer.style.padding = this.originalPadding;
        }

        document.getElementById('jobs-search-tab')?.removeEventListener('click', this.handleSearchTabClick);
        document.getElementById('jobs-saved-tab')?.removeEventListener('click', this.handleSavedTabClick);
    }

    async init() {
        await this.loadHTML("/frontend/blocks/jobs/jobs.template");
        this.loadCSS("/frontend/blocks/jobs/jobs.css");

        if (authService.isLoggedIn()) {
            const savedJobIds = await MyApi.getSavedItems();
            this.savedJobs = new Set(savedJobIds);
        }

        this.searchBar();
        this.showSearchView();
    }

    loadCSS(path) {
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', path);
        this.shadowRoot.appendChild(styleLink);
    }

    setupHeaderTabs() {
        const searchTab = document.getElementById('jobs-search-tab');
        const savedTab = document.getElementById('jobs-saved-tab');
        if (searchTab && savedTab) {
            searchTab.addEventListener('click', this.handleSearchTabClick);
            savedTab.addEventListener('click', this.handleSavedTabClick);
        }
    }

    handleSearchTabClick(e) {
        e.preventDefault();
        if (this.currentView !== 'search') {
            this.currentView = 'search';
            this.updateActiveTab();
            this.showSearchView();
        }
    }

    handleSavedTabClick(e) {
        e.preventDefault();
        if (this.currentView !== 'saved') {
            this.currentView = 'saved';
            this.updateActiveTab();
            this.showSavedView();
        }
    }

    updateActiveTab() {
        const searchTab = document.getElementById('jobs-search-tab');
        const savedTab = document.getElementById('jobs-saved-tab');
        if (!searchTab || !savedTab) return;
        searchTab.classList.toggle('active', this.currentView === 'search');
        savedTab.classList.toggle('active', this.currentView === 'saved');
    }

    async showSearchView() {
        const listPanel = this.shadowRoot.querySelector('.jobs-list-panel');
        const detailPanel = this.shadowRoot.querySelector('.jobs-detail-panel');
        if (!listPanel || !detailPanel) return;

        listPanel.innerHTML = `<p style="padding: 20px;">Loading jobs...</p>`;
        detailPanel.innerHTML = `<p>Select a job to view details.</p>`;

        try {
            const response = await fetch(`${API_URL_BASE}/api/jobs`, { cache: 'no-cache' }); 
            const jobs = await response.json();
            if (!response.ok) throw new Error('Failed to load jobs');

            this.allJobs = jobs.map(job => ({ ...job, isSaved: this.savedJobs.has(job.id) }));
            this.renderJobsList(this.allJobs);

            if (this.allJobs.length > 0) {
                this.renderJobDetail(this.allJobs[0]);
            } else {
                detailPanel.innerHTML = `<p>No jobs to display</p>`;
            }
        } catch (error) {
            console.error("Fetch error:", error);
            listPanel.innerHTML = `<p>Failed to load jobs.</p>`;
        }
    }

    async showSavedView() {
        const listPanel = this.shadowRoot.querySelector('.jobs-list-panel');
        const detailPanel = this.shadowRoot.querySelector('.jobs-detail-panel');
        if (!listPanel || !detailPanel) return;

        listPanel.innerHTML = `<p style="padding: 20px;">Loading saved jobs...</p>`;
        detailPanel.innerHTML = '';

        try {
            const savedJobsList = await MyApi.getSavedJobsDetails();
            this.allJobs = savedJobsList.map(job => ({ ...job, isSaved: true }));
            this.renderJobsList(this.allJobs);

            if (this.allJobs.length > 0) {
                this.renderJobDetail(this.allJobs[0]);
            } else {
                listPanel.innerHTML = `<p style="padding: 20px;">You have no saved jobs.</p>`;
                detailPanel.innerHTML = `<p>Your saved jobs will appear here.</p>`;
            }
        } catch (error) {
            listPanel.innerHTML = `<p>Could not load saved jobs.</p>`;
        }
    }

    searchBar() {
        const searchInput = this.shadowRoot.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const query = event.target.value.toLowerCase();
                const sourceList = this.allJobs;

                const filteredJobs = sourceList.filter(job => {
                    const title = (job.title || '').toLowerCase();
                    const company = (job.company_name || '').toLowerCase();
                    return title.includes(query) || company.includes(query);
                });
                this.renderJobsList(filteredJobs);
            });
        }
    }

    renderJobsList(jobs) {
        const listPanel = this.shadowRoot.querySelector('.jobs-list-panel');
        if (!listPanel) return;
        listPanel.innerHTML = '';
        if (jobs.length === 0) {
            listPanel.innerHTML = `<p style="padding: 20px;">No jobs available.</p>`;
        } else {
            jobs.forEach(job => {
                const jobCard = this.createJobCard(job);
                listPanel.appendChild(jobCard);
            });
            this.highlightActiveJobCard();
        }
    }

    createJobCard(job) {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.dataset.jobId = job.id;

        const isSaved = this.savedJobs.has(job.id);

        card.innerHTML = `
            <div class="job-card__header">
                <img class="job-card__logo" src="${job.company_logo || 'https://placehold.co/48x48/1D1B20/F3F3F3?text=Logo'}" alt="${job.company_name} logo">
                <div class="job-card__title-group">
                    <h3 class="job-card__title">${job.title || 'No Title'}</h3>
                    <p class="job-card__company">${job.company_name || 'No Company'}</p>
                </div>
                <div class="job-card__actions">
                    <button class="job-card__icon-button ${isSaved ? 'is-saved' : ''}">
                        <img class="save-icon" src="frontend/assets/icons/bookmark_filled.svg" alt="Save icon">
                    </button>
                    <button class="job-card__icon-button">
                        <img src="frontend/assets/icons/X.svg" alt="Hide icon">
                    </button>
                </div>
            </div>
            <div class="job-card__body">
                ${(job.description || '').substring(0, 100)}...
            </div>
            <p class="job-card__meta">${job.location || 'N/A'} - ${this.formatDate(job.posted_date)}</p>
        `;

        card.addEventListener('click', () => {
             this.renderJobDetail(job);
        });

        const saveButton = card.querySelector('.job-card__icon-button');
        saveButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.toggleSaveState(job.id);
        });

        return card;
    }

    renderJobDetail(job) {
        this.activeJobId = job.id;
        this.highlightActiveJobCard();
        const detailPanel = this.shadowRoot.querySelector('.jobs-detail-panel');
        if (!detailPanel || !job) {
            detailPanel.innerHTML = `<p>Select a job to view details.</p>`;
            return;
        }

        const isSaved = this.savedJobs.has(job.id);
        const saveButtonText = isSaved ? "Saved" : "Save";
        const isSavedClass = isSaved ? "is-saved" : "";
        
        let benefitsHtml = '';
        if (job.benefits_list && Array.isArray(job.benefits_list) && job.benefits_list.length > 0) {
            const benefitsItems = job.benefits_list.map(benefit => `<li class="job-detail__offer-item">${benefit}</li>`).join('');
            benefitsHtml = `
                <hr class="job-detail__divider">
                <div class="job-detail__section">
                    <h3 class="job-detail__section-title">What this job offer</h3>
                    <ul class="job-detail__offer-list">
                        ${benefitsItems}
                    </ul>
                </div>
            `;
        }

        detailPanel.innerHTML = `
            <div class="job-detail__content-wrapper"> 
                <div class="job-detail__header">
                    <img class="job-detail__logo" src="${job.company_logo || 'https://placehold.co/48x48/1D1B20/F3F3F3?text=Logo'}" alt="Company Logo">
                    <div class="job-detail__title-group">
                        <h3 class="job-detail__company-name">${job.company_name || 'Company Name'}</h3>
                        <p class="job-detail__company-location">${job.location || 'Remote'}</p>
                    </div>
                </div>
                <div class="job-detail__title-info">
                    <h2 class="job-detail__title">${job.title || 'Job Title'}</h2>
                    <p class="job-detail__posted-info">Posted ${this.formatDate(job.posted_date)} - Apply by ${this.formatDate(job.application_deadline)}</p>
                </div>
                <div class="job-detail__actions">
                    <button class="job-detail__action-button job-detail__action-button--save ${isSavedClass}" data-job-id="${job.id}">
                        <span class="job-detail__action-icon">
                            <img class="save-icon" src="frontend/assets/icons/bookmark_filled.svg" alt="Save icon">
                        </span>
                        ${saveButtonText}
                    </button>
                    <button class="job-detail__action-button job-detail__action-button--apply">
                        <span class="job-detail__action-icon">
                            <img src="frontend/assets/icons/external_link.svg" alt="Apply icon">
                        </span>
                        Apply externally
                    </button>
                    <button class="job-detail__action-button job-detail__action-button--share">
                        <span class="job-detail__action-icon">
                            <img src="frontend/assets/icons/more_horiz.svg" alt="Share icon">
                        </span>
                    </button>
                </div>
                <hr class="job-detail__divider">
                <div class="job-detail__section">
                    <h3 class="job-detail__section-title">At a glance</h3>
                    <div class="job-detail__glance-items">
                        <div class="job-detail__glance-item">
                            <span class="job-detail__glance-icon"><img src="frontend/assets/icons/credit_card.svg" alt="Salary icon"></span>
                            <p class="job-detail__glance-text">
                                <span class="job-detail__glance-text--bold">${job.salary || 'Salary not specified'}</span><br/>
                                ${Array.isArray(job.benefits_list) && job.benefits_list.length > 0 ? job.benefits_list.slice(0, 2).join(', ') + '...' : 'No benefits listed'}
                            </p>
                        </div>
                        <div class="job-detail__glance-item">
                            <span class="job-detail__glance-icon"><img src="frontend/assets/icons/location_on.svg" alt="Location icon"></span>
                            <p class="job-detail__glance-text">
                                <span class="job-detail__glance-text--bold">${job.location || 'Remote'}</span><br/>
                                ${job.workplace_type || ''}
                            </p>
                        </div>
                        <div class="job-detail__glance-item">
                            <span class="job-detail__glance-icon"><img src="frontend/assets/icons/jobs.svg" alt="Job type icon"></span>
                            <p class="job-detail__glance-text">
                                <span class="job-detail__glance-text--bold">${job.employment_type || 'Job'}</span><br/>
                                ${job.contractType || ''}
                            </p>
                        </div>
                    </div>
                </div>
                <hr class="job-detail__divider">
                <div class="job-detail__section">
                    <h3 class="job-detail__section-title">About</h3>
                    <p class="job-detail__about-text">${job.description || 'No description available.'}</p>
                    <button class="job-detail__read-more">
                        More
                        <span class="job-detail__read-more-icon"><img src="frontend/assets/icons/keyboard_arrow_down.svg" alt="Read more arrow icon"></span>
                    </button>
                </div>
                ${benefitsHtml}
                <hr class="job-detail__divider">
                <div class="job-detail__section">
                    <h3 class="job-detail__section-title">About the employer</h3>
                    <div class="job-detail__employer-header">
                        <img class="job-detail__employer-logo" src="${job.employer_logo || 'https://placehold.co/48x48/1D1B20/F3F3F3?text=Logo'}" alt="Employer Logo">
                        <div class="job-detail__employer-info">
                            <h4 class="job-detail__employer-name">${job.company_name || 'Company Name'}</h4>
                            <p class="job-detail__employer-location">${job.employer_location || 'Location'}</p>
                        </div>
                        <button class="job-detail__action-button job-detail__action-button--follow">Follow</button>
                    </div>
                    <p class="job-detail__employer-text">${job.employer_description || 'No description available.'}</p>
                </div>
            </div>`;

        const saveButton = detailPanel.querySelector('.job-detail__action-button--save');
        saveButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.toggleSaveState(job.id);
        });
    }



    toggleSaveState(jobId) {
        const isCurrentlySaved = this.savedJobs.has(jobId);
        const action = isCurrentlySaved ? DATA_COMMAND.UNSAVE_ITEM : DATA_COMMAND.SAVE_ITEM;

        if (isCurrentlySaved) {
            this.savedJobs.delete(jobId);
        } else {
            this.savedJobs.add(jobId);
        }

        if (this.currentView === 'saved' && isCurrentlySaved) {
             const cardToRemove = this.shadowRoot.querySelector(`.job-card[data-job-id="${jobId}"]`);
             if (cardToRemove) cardToRemove.remove();

             const remainingJobs = this.allJobs.filter(j => j.id !== jobId);
             this.allJobs = remainingJobs;
             if(remainingJobs.length > 0) {
                 this.renderJobDetail(remainingJobs[0]);
             } else {
                 this.shadowRoot.querySelector('.jobs-detail-panel').innerHTML = `<p style="padding: 20px;">You have no saved jobs.</p>`;
             }
        }

        this.updateSaveButtonStates(jobId);

        const command = new Command(action, { itemId: jobId });
        const executor = new DataCommandExecutor(MyApi);
        executor.execute(command);
    }

    updateSaveButtonStates(jobId) {
        const isSaved = this.savedJobs.has(jobId);

        const jobCard = this.shadowRoot.querySelector(`.job-card[data-job-id="${jobId}"]`);
        if (jobCard) {
            const saveButton = jobCard.querySelector('.job-card__icon-button');
            if(saveButton) {
                saveButton.classList.toggle('is-saved', isSaved);
            }
        }

        if (jobId === this.activeJobId) {
            const detailButton = this.shadowRoot.querySelector('.job-detail__action-button--save');
            if (detailButton) {
                detailButton.classList.toggle('is-saved', isSaved);
                const saveButtonText = isSaved ? "Saved" : "Save";
                detailButton.innerHTML = `
                    <span class="job-detail__action-icon">
                        <img class="save-icon" src="frontend/assets/icons/bookmark_filled.svg" alt="Save icon">
                    </span>
                    ${saveButtonText}
                `;
            }
        }
    }

    highlightActiveJobCard() {
        this.shadowRoot.querySelectorAll('.job-card').forEach(card => {
            card.classList.toggle('active', card.dataset.jobId == this.activeJobId);
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return 'Invalid Date';
        }
    }
}

customElements.define("jobs-section", JobsSectionComponent);
export default JobsSectionComponent;