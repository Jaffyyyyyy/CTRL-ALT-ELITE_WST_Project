document.addEventListener('DOMContentLoaded', () => {
    const navElement = document.querySelector('body > nav');
    const navPath = navElement.getAttribute('data-nav-path');

    if (navPath) {
        fetch(navPath)
            .then(response => response.text())
            .then(data => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                navElement.replaceWith(tempDiv.firstChild);

                if (navPath.includes('_advisor-nav.html')) {
                    const logoutBtn = document.getElementById('logout-btn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            sessionStorage.removeItem('isAdvisorLoggedIn');
                            window.location.href = 'index.html';
                        });
                    }
                }
            })
            .catch(error => console.error('Error loading navigation:', error));
    }
});
