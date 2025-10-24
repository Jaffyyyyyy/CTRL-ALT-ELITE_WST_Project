function handleLogout(event) {
    event.preventDefault();
    sessionStorage.removeItem('isAdvisorLoggedIn');
    window.location.href = 'index.html';
}
