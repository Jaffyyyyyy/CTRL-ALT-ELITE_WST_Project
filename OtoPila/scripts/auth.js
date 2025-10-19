document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorAlert = document.getElementById('error-alert');

    const ADVISOR_USERNAME = 'admin';
    const ADVISOR_PASSWORD = 'password123';

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === ADVISOR_USERNAME && password === ADVISOR_PASSWORD) {
            sessionStorage.setItem('isAdvisorLoggedIn', 'true');
            window.location.href = 'advisor-dashboard.html';
        } else {
            errorAlert.classList.remove('d-none');
            passwordInput.value = '';
        }
    });
});
