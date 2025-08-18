import BaseHTMLElement from "../base/BaseHTMLElement.js";

const API_URL_BASE = 'http://localhost:3000';

class JobsSectionComponent extends BaseHTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.allJobs = [];
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.loadHTML("/frontend/blocks/jobs/jobs.template");
        
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/frontend/blocks/jobs/jobs.css');
        this.shadowRoot.appendChild(styleLink);

        const pageTitleElement = document.getElementById("page-title");
        if (pageTitleElement) {
            pageTitleElement.textContent = "Jobs";
        }
        
        await this.fetchAndRenderJobs();
        this.searchBar();
    }
    
    async fetchAndRenderJobs() {
        const jobsListingContainer = this.shadowRoot.querySelector('.jobs-section__listing');
        const jobsDetailContainer = this.shadowRoot.querySelector('.jobs-section__detail');

        if (!jobsListingContainer || !jobsDetailContainer) {
            return;
        }

        jobsListingContainer.innerHTML = `<p class="text-center text-gray-500">Loading jobs...</p>`;
        jobsDetailContainer.innerHTML = `<p class="text-center text-gray-500">Select a job to view details.</p>`;

        try {
            const response = await fetch(`${API_URL_BASE}/api/jobs`);
            const jobs = await response.json();

            if (!response.ok || !Array.isArray(jobs)) {
                return;
            }

            this.allJobs = jobs;
            this.renderJobsList(this.allJobs);
            
            if (this.allJobs.length > 0) {
                this.renderJobDetail(this.allJobs[0]);
            } else {
                jobsDetailContainer.innerHTML = `<p class="text-center text-gray-500">No jobs to display.</p>`;
            }
        } catch (error) {
            jobsListingContainer.innerHTML = `<p class="text-center text-gray-500">Failed to load jobs.</p>`;
            return;
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
        if (!jobsListingContainer) {
            return;
        }

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
        div.innerHTML = `
            <div class="job-card__header">
                <img class="job-card__logo" src="${job.company_logo || 'https://placehold.co/48x48/1D1B20/F3F3F3?text=Logo'}" alt="Company Logo">
                <div class="job-card__title-group">
                    <h3 class="job-card__title">${job.title || 'Job Title'}</h3>
                    <p class="job-card__subtitle">${job.company_name || 'Company Name'}</p>
                </div>
                <button class="job-card__action-icon job-card__action-icon--save">
                    <img src="frontend/assets/icons/bookmark_filled.svg" alt="Save icon">
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
        return div;
    }

    renderJobDetail(job) {
        const jobsDetailContainer = this.shadowRoot.querySelector('.jobs-section__detail');
        if (!jobsDetailContainer || !job) {
            return;
        }

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
                <button class="job-detail__action-button job-detail__action-button--save">
                    <span class="job-detail__action-icon">
                        <img src="frontend/assets/icons/bookmark_filled.svg" alt="Save icon">
                    </span>
                    Save
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
                        <span class="job-detail__glance-icon">
                            <img src="frontend/assets/icons/credit_card.svg" alt="Salary icon">
                        </span>
                        <p class="job-detail__glance-text">
                            <span class="job-detail__glance-text--bold">${job.salary || 'Salary not specified'}</span><br/>
                            ${job.benefits_list && job.benefits_list.length > 0 ? job.benefits_list.join(', ') : 'No benefits listed'}
                        </p>
                    </div>
                    <div class="job-detail__glance-item">
                        <span class="job-detail__glance-icon">
                            <img src="frontend/assets/icons/location_on.svg" alt="Location icon">
                        </span>
                        <p class="job-detail__glance-text">
                            <span class="job-detail__glance-text--bold">${job.location || 'Remote'}</span><br/>
                            ${job.workplace_type || ''}
                        </p>
                    </div>
                    <div class="job-detail__glance-item">
                        <span class="job-detail__glance-icon">
                            <img src="frontend/assets/icons/jobs.svg" alt="Job type icon"> 
                        </span>
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
                    <span class="job-detail__read-more-icon">
                        <img src="frontend/assets/icons/keyboard_arrow_down.svg" alt="Read more arrow icon">
                    </span>
                </button>
            </div>

            <hr class="job-detail__divider">

            <div class="job-detail__section">
                <h3 class="job-detail__section-title">What this job offers</h3>
                <ul class="job-detail__offer-list">
                    ${(job.benefits_list || []).map(item => `
                        <li class="job-detail__offer-item">${item}</li>
                    `).join('')}
                </ul>
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
                    <button class="job-detail__action-button job-detail__action-button--follow">
                        Follow
                    </button>
                </div>
                <p class="job-detail__employer-text">${job.employer_description || 'No description available.'}</p>
            </div>
        `;
    }

    formatDate(dateString) {
        if (!dateString) return 'Not specified';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    disconnectedCallback() {
    }
}

customElements.define("jobs-section", JobsSectionComponent);
export default JobsSectionComponent;