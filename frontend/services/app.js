import Router from '../services/router.js';
document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profile-button');
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            Router.go('/register'); 
        });
    }


});