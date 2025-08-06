const BACKEND_URL = "http://localhost:3000";

const authService = {
    async login(credentials) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                return { generalError: data.message || 'Error in login.' };
            }

            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
            }
            if (data.user) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            
            return {
                message: data.message || 'succsesful login',
                token: data.token,
                user: data.user
            };

        } catch (error) {
            return { generalError: 'Error, try again' };
        }
    },

    async createUser(userData) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                return { generalError: data.message || 'Error in register' };
            }

            return {
                message: data.message || 'registration error',
                user: data.user
            };

        } catch (error) {
            return { generalError: 'Error, try again' };
        }
    },

    logout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('currentUser');
        document.body.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'login' } }));
    },

    getToken() {
        return localStorage.getItem('jwtToken');
    },

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    isLoggedIn() {
        return !!localStorage.getItem('jwtToken');
    }
};

export default authService;