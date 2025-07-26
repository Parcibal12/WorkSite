const feedSectionHTML = `
    <section class="feed-page">
        <div class="feed-page__container">
            <div class="feed-filters">
                <button class="feed-filters__button">All</button>
                <button class="feed-filters__button">Employers</button>
            </div>
            
            <div class="create-post">
                <div class="create-post__avatar"></div>
                <input type="text" class="create-post__input" placeholder="Share something with the community...">
            </div>

            <article class="post-card">
                <div class="post-card__header">
                    <div class="post-card__avatar"></div>
                    <div class="post-card__info">
                        <h3 class="post-card__username">User name</h3>
                        <p class="post-card__profession">Profession</p>
                        <p class="post-card__description">Description</p>
                    </div>
                </div>

                <div class="post-card__media"></div>

            <div class="post-card__actions">
                <div class="post-card__action-item">
                    <span class="post-card__action-icon">
                        <img src="/frontend/assets/icons/Heart.svg" alt="Me gusta" class="post-card__action-icon-img">
                    </span>
                    <span class="post-card__action-count">10</span>
                </div>
                <div class="post-card__action-item">
                    <span class="post-card__action-icon">
                        <img src="/frontend/assets/icons/comment.svg" alt="Comentar" class="post-card__action-icon-img">
                    </span>
                    <span class="post-card__action-count">2</span>
                </div>
                <div class="post-card__action-item">
                    <span class="post-card__action-icon">
                        <img src="/frontend/assets/icons/bookmark_filled.svg" alt="Guardar" class="post-card__action-icon-img">
                    </span>
                </div>
            </div>
            </article>

            <div class="comment-input">
                <input type="text" class="comment-input__space placeholder="Add a comment...">
            </div>
        </div>
    </section>
`;

class FeedSectionComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        

        this.shadowRoot.innerHTML = feedSectionHTML; 
        
        this.styleElement = document.createElement('style');
    }

    connectedCallback() {

        fetch('/frontend/blocks/feed/feed.css')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for feed-section.css`);
                }
                return response.text();
            })
            .then(cssContent => {
                this.styleElement.textContent = cssContent;
                this.shadowRoot.appendChild(this.styleElement);
            })

    }

    disconnectedCallback() {
    }
}

customElements.define('feed-section', FeedSectionComponent);