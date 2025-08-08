import Router from '../services/router.js';

document.addEventListener('DOMContentLoaded', () => {
    Router.init();
    
    const profileButton = document.getElementById('profile-button');
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            document.body.dispatchEvent(new CustomEvent('navigate', {
                detail: { page: 'register' }
            }));
        });
    }
});
