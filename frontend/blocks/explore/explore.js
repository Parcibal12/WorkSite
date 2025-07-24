const exploreSectionTemplate = document.createElement('template');
exploreSectionTemplate.innerHTML = `
<section class="explore">
    <div class="explore__container">
        <div class="explore__top-jobs">
            <div class="explore__top-jobs-header">
                <h2 class="explore__section-title">Top jobs for you</h2>
                <a href="#" class="explore__view-more">View more</a>
            </div>

            <div class="explore__top-jobs-list">
                <article class="job-card">
                    <button class="tarjeta-empleo__boton-guardar" aria-label="Guardar oferta de trabajo">
                        <img src="/frontend/assets/icons/bookmark_filled.svg" alt="Icono de guardar" class="tarjeta-empleo__boton-guardar-icono">
                    </button> 
                    <div class="job-card__image">[img]</div>
                    <h3 class="job-card__company">Company Name</h3>
                    <p class="job-card__role">Job Role</p>
                    <p class="job-card__details">Job details and description go here.</p>
                    <p class="job-card__location">Location</p>
                </article>

                <article class="job-card">
                    <button class="tarjeta-empleo__boton-guardar" aria-label="Guardar oferta de trabajo">
                        <img src="/frontend/assets/icons/bookmark_filled.svg" alt="Icono de guardar" class="tarjeta-empleo__boton-guardar-icono">
                    </button> 
                    <div class="job-card__image">[img]</div>
                    <h3 class="job-card__company">Company Name</h3>
                    <p class="job-card__role">Job Role</p>
                    <p class="job-card__details">Job details and description go here.</p>
                    <p class="job-card__location">Location</p>
                </article>

                <article class="job-card">
                    <button class="tarjeta-empleo__boton-guardar" aria-label="Guardar oferta de trabajo">
                        <img src="/frontend/assets/icons/bookmark_filled.svg" alt="Icono de guardar" class="tarjeta-empleo__boton-guardar-icono">
                    </button> 
                    <div class="job-card__image">[img]</div>
                    <h3 class="job-card__company">Company Name</h3>
                    <p class="job-card__role">Job Role</p>
                    <p class="job-card__details">Job details and description go here.</p>
                    <p class="job-card__location">Location</p>
                </article>
            </div>
        </div>

        <h2 class="explore__section-title">Suggested job searches</h2>
        <div class="explore__suggested-searches">
            <button class="search-button">
                <img src="/frontend/assets/icons/search.svg" alt="Search Icon" class="search-button__icon">
                Part time
            </button>

            <button class="search-button">
                <img src="/frontend/assets/icons/search.svg" alt="Search Icon" class="search-button__icon">
                Full time
            </button>

            <button class="search-button">
                <img src="/frontend/assets/icons/search.svg" alt="Search Icon" class="search-button__icon">
                Remote
            </button>

            <button class="search-button">
                <img src="/frontend/assets/icons/search.svg" alt="Search Icon" class="search-button__icon">
                Internship
            </button>
        </div>

        <div class="explore__content-for-you">
            <div class="explore__content-for-you-header">
                <h2 class="explore__section-title">Content for you</h2>
                <a href="#" class="explore__view-more">Go to feed</a>
            </div>
            <div class="explore__content-list">
                <!-- Tarjeta de Contenido 1 -->
                <div class="content-card">
                    <div class="content-card__footer">
                        <p class="content-card__text">Lorem ipsum</p>
                        <button class="content-card__like-button" aria-label="Like">
                            <img src="/frontend/assets/icons/Heart.svg" alt="Like icon" class="content-card__icon">
                        </button>
                    </div>
                </div>

                <div class="content-card">
                    <div class="content-card__footer">
                        <p class="content-card__text">Lorem ipsum</p>
                        <button class="content-card__like-button" aria-label="Like">
                            <img src="/frontend/assets/icons/Heart.svg" alt="Like icon" class="content-card__icon">
                        </button>
                    </div>
                </div>  

                <div class="content-card">
                    <div class="content-card__footer">
                        <p class="content-card__text">Lorem ipsum</p>
                        <button class="content-card__like-button" aria-label="Like">
                            <img src="/frontend/assets/icons/Heart.svg" alt="Like icon" class="content-card__icon">
                        </button>
                    </div>
                </div>  
            </div>
        </div>
    </div>
</section>
`;

class ExploreSectionComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(exploreSectionTemplate.content.cloneNode(true));
        this.styles = document.createElement('style');
    }

    connectedCallback() {
        fetch('/frontend/blocks/explore/explore.css')
            .then(response => response.text())
            .then(cssContent => {
                this.styles.textContent = cssContent;
                this.shadowRoot.appendChild(this.styles);
            })

    }

    disconnectedCallback() {
    }
}

customElements.define('explore-section', ExploreSectionComponent);