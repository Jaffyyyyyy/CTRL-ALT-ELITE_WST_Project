(() => {
    const isAdvisorLoggedIn = sessionStorage.getItem('isAdvisorLoggedIn');
    if (isAdvisorLoggedIn !== 'true') {
        window.location.href = 'advisor-portal.html';
    }
})();
