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
        
        this.handleSearchTabClick = this.handleSearchTabClick.bind(this);
        this.handleSavedTabClick = this.handleSavedTabClick.bind(this);
    }

    connectedCallback() {
        this.init();
        this.setupHeaderTabs();
    }

    disconnectedCallback() {
        document.getElementById('jobs-search-tab')?.removeEventListener('click', this.handleSearchTabClick);
        document.getElementById('jobs-saved-tab')?.removeEventListener('click', this.handleSavedTabClick);
    }

    async init() {
        await this.loadHTML("/frontend/blocks/jobs/jobs.template");

        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/jobs/jobs.css');
        this.shadowRoot.appendChild(styleLink);

        if (authService.isLoggedIn()) {
            const savedJobIds = await MyApi.getSavedItems();
            this.savedJobs = new Set(savedJobIds);
        }

        this.searchBar();
        this.showSearchView();
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

        if (this.currentView === 'search') {
            searchTab.classList.add('active');
            savedTab.classList.remove('active');
        } else {
            savedTab.classList.add('active');
            searchTab.classList.remove('active');
        }
    }


    async showSearchView() {
        const jobsListingContainer = this.shadowRoot.querySelector('.jobs-section__listing');
        const jobsDetailContainer = this.shadowRoot.querySelector('.jobs-section__detail');
        if (!jobsListingContainer || !jobsDetailContainer) return;
        
        jobsListingContainer.innerHTML = `<p class="text-center text-gray-500">Loading jobs...</p>`;
        jobsDetailContainer.innerHTML = `<p class="text-center text-gray-500">Select a job to view details.</p>`;

        try {
            const response = await fetch(`${API_URL_BASE}/api/jobs`);
            const jobs = await response.json();
            if (!response.ok || !Array.isArray(jobs)) {
                throw new Error('Failed to load jobs');
            }

            this.allJobs = jobs.map(job => ({ ...job, isSaved: this.savedJobs.has(job.id) }));
            this.renderJobsList(this.allJobs);

            if (this.allJobs.length > 0) {
                this.renderJobDetail(this.allJobs[0]);
                this.updateJobDetailButton(this.allJobs[0].id);
            } else {
                jobsDetailContainer.innerHTML = `<p class="text-center text-gray-500">No jobs to display</p>`;
            }
        } catch (error) {
            jobsListingContainer.innerHTML = `<p class="text-center text-gray-500">Failed to load jobs.</p>`;
        }
    }

    async showSavedView() {
        const jobsListingContainer = this.shadowRoot.querySelector('.jobs-section__listing');
        const jobsDetailContainer = this.shadowRoot.querySelector('.jobs-section__detail');
        if (!jobsListingContainer || !jobsDetailContainer) return;

        jobsListingContainer.innerHTML = `<p class="text-center text-gray-500">Loading saved jobs...</p>`;
        jobsDetailContainer.innerHTML = '';
        
        try {
            const savedJobsList = await MyApi.getSavedJobsDetails(); 
            
            this.allJobs = savedJobsList.map(job => ({ ...job, isSaved: true }));
            this.renderJobsList(this.allJobs);
            
            if (this.allJobs.length > 0) {
                this.renderJobDetail(this.allJobs[0]);
            } else {
                jobsListingContainer.innerHTML = `<p class="text-center text-gray-500">You have no saved jobs.</p>`;
                jobsDetailContainer.innerHTML = `<p class="text-center text-gray-500">Your saved jobs will appear here.</p>`;
            }
        } catch (error) {
            console.error(error);
            jobsListingContainer.innerHTML = `<p class="text-center text-gray-500">Could not load saved jobs.</p>`;
        }
    }
    

    

    searchBar() {
        const searchInput = this.shadowRoot.querySelector('.jobs-section__search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const query = event.target.value.toLowerCase();
                const filteredJobs = this.allJobs.filter(job => {
                    const title = job.title ? job.title.toLowerCase() : '';
                    const company = job.company_name ? job.company_name.toLowerCase() : '';
                    return title.includes(query) || company.includes(query);
                });
                this.renderJobsList(filteredJobs);
                if (filteredJobs.length > 0) {
                    this.renderJobDetail(filteredJobs[0]);
                } else {
                    const jobsDetailContainer = this.shadowRoot.querySelector('.jobs-section__detail');
                    if (jobsDetailContainer) {
                        jobsDetailContainer.innerHTML = `<p class="text-center text-gray-500">No jobs match your search.</p>`;
                    }
                }
            });
        }
    }

    renderJobsList(jobs) {
        const jobsListingContainer = this.shadowRoot.querySelector('.jobs-section__listing');
        if (!jobsListingContainer) return;

        jobsListingContainer.innerHTML = '';
        if (jobs.length === 0) {
            jobsListingContainer.innerHTML = `<p class="text-center text-gray-500">No jobs available.</p>`;
        } else {
            jobs.forEach((job, index) => {
                const jobCard = this.createJobCard(job);
                jobsListingContainer.appendChild(jobCard);
                if (index < jobs.length - 1) {
                    const divider = document.createElement('hr');
                    divider.className = 'job-card__divider';
                    jobsListingContainer.appendChild(divider);
                }
                jobCard.addEventListener('click', () => this.renderJobDetail(job));
            });
        }
    }

    createJobCard(job) {
        const div = document.createElement('div');
        div.className = 'job-card';
        div.dataset.jobId = job.id;

        const isSavedClass = this.savedJobs.has(job.id) ? "is-saved" : "";

        div.innerHTML = `
            <div class="job-card__header">
                <img class="job-card__logo" src="${job.company_logo || 'https://placehold.co/48x48/1D1B20/F3F3F3?text=Logo'}" alt="Company Logo">
                <div class="job-card__title-group">
                    <h3 class="job-card__title">${job.title || 'Job Title'}</h3>
                    <p class="job-card__subtitle">${job.company_name || 'Company Name'}</p>
                </div>
                <button class="job-card__action-icon job-card__action-icon--save ${isSavedClass}">
                    <img class="save-icon" src="frontend/assets/icons/bookmark_filled.svg" alt="Save icon">
                </button>
                <button class="job-card__action-icon job-card__action-icon--apply">
                    <img src="frontend/assets/icons/X.svg" alt="Apply icon">
                </button>
            </div>
            <div class="job-card__body">
                <p class="job-card__description">${job.description || 'No description available.'}</p>
                <p class="job-card__meta">${job.location || 'Remote'} - ${this.formatDate(job.posted_date)}</p>
            </div>
        `;

        const saveButton = div.querySelector('.job-card__action-icon--save');
        saveButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isCurrentlySaved = this.savedJobs.has(job.id);
            const action = isCurrentlySaved ? DATA_COMMAND.UNSAVE_ITEM : DATA_COMMAND.SAVE_ITEM;

            if (isCurrentlySaved) {
                this.savedJobs.delete(job.id);
                saveButton.classList.remove('is-saved');
            } else {
                this.savedJobs.add(job.id);
                saveButton.classList.add('is-saved');
            }
            const command = new Command(action, { itemId: job.id, data: job });
            const executor = new DataCommandExecutor(MyApi);
            executor.execute(command);
            this.updateJobDetailButton(job.id);

            if (this.currentView === 'saved' && isCurrentlySaved) {
                this.allJobs = this.allJobs.filter(j => j.id !== job.id);
                this.renderJobsList(this.allJobs);
                if(this.allJobs.length > 0) {
                    this.renderJobDetail(this.allJobs[0]);
                } else {
                    this.shadowRoot.querySelector('.jobs-section__detail').innerHTML = `<p class="text-center text-gray-500">No saved jobs to display.</p>`
                }
            }
        });

        return div;
    }

    renderJobDetail(job) {
        const jobsDetailContainer = this.shadowRoot.querySelector('.jobs-section__detail');
        if (!jobsDetailContainer || !job) {
            jobsDetailContainer.innerHTML = `<p class="text-center text-gray-500">Select a job to view details.</p>`;
            return;
        }

        const isSavedClass = this.savedJobs.has(job.id) ? "is-saved" : "";
        const saveButtonText = this.savedJobs.has(job.id) ? "Saved" : "Save";

        jobsDetailContainer.innerHTML = `
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
                            ${job.benefits_list && job.benefits_list.length > 0 ? job.benefits_list.join(', ') : 'No benefits listed'}
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
        `;

        const saveButton = jobsDetailContainer.querySelector('.job-detail__action-button--save');
        saveButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isCurrentlySaved = this.savedJobs.has(job.id);
            const action = isCurrentlySaved ? DATA_COMMAND.UNSAVE_ITEM : DATA_COMMAND.SAVE_ITEM;

            if (isCurrentlySaved) {
                this.savedJobs.delete(job.id);
            } else {
                this.savedJobs.add(job.id);
            }

            this.updateJobDetailButton(job.id);
            this.updateJobListButton(job.id);

            const command = new Command(action, { itemId: job.id, data: job });
            const executor = new DataCommandExecutor(MyApi);
            executor.execute(command);
        });
    }

    updateJobListButton(jobId) {
        const jobCard = this.shadowRoot.querySelector(`.job-card[data-job-id="${jobId}"]`);
        if (jobCard) {
            const saveButton = jobCard.querySelector('.job-card__action-icon--save');
            if (this.savedJobs.has(jobId)) {
                saveButton.classList.add('is-saved');
            } else {
                saveButton.classList.remove('is-saved');
            }
        }
    }

    updateJobDetailButton(jobId) {
        const jobDetailContainer = this.shadowRoot.querySelector('.jobs-section__detail');
        if (!jobDetailContainer) return;

        const saveButton = jobDetailContainer.querySelector(`.job-detail__action-button--save[data-job-id="${jobId}"]`);
        if (saveButton) {
            const isSaved = this.savedJobs.has(jobId);
            saveButton.classList.toggle('is-saved', isSaved);
            
            const saveButtonText = isSaved ? "Saved" : "Save";
            saveButton.innerHTML = `
                <span class="job-detail__action-icon">
                    <img class="save-icon" src="frontend/assets/icons/bookmark_filled.svg" alt="Save icon">
                </span>
                ${saveButtonText}
            `;
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'Not specified';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
}

customElements.define("jobs-section", JobsSectionComponent);
export default JobsSectionComponent;