document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews-container');
    const prevButton = document.getElementById('prev-review');
    const nextButton = document.getElementById('next-review');
    let currentIndex = 0;
    let reviews = [];
    let slideshowInterval;

    const renderReview = (index) => {
        const review = reviews[index];
        reviewsContainer.classList.add('review-fade-out');
        setTimeout(() => {
            reviewsContainer.innerHTML = `
                <div class="testimonial-item text-center">
                    <div class="testimonial-avatar mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                    </div>
                    <h5 class="fw-bold">${review.name}</h5>
                    <div class="star-rating mb-2">
                        ${Array(review.rating).fill(0).map(() => `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>
                        `).join('')}
                    </div>
                    <p class="fw-bold lead">"${review.quote}"</p>
                    <p class="font-weight-light mb-0">"${review.comment}"</p>
                </div>
            `;
            reviewsContainer.classList.remove('review-fade-out'); // Remove fade-out
            reviewsContainer.classList.add('review-fade-in'); // Add fade-in
            reviewsContainer.addEventListener('animationend', () => {
                reviewsContainer.classList.remove('review-fade-in');
            }, { once: true });
        }, 500);
    };

    const startSlideshow = () => {
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % reviews.length;
            renderReview(currentIndex);
        }, 5000);
    };

    if (reviewsContainer) {
        const loadReviews = () => {
            const localReviews = JSON.parse(localStorage.getItem('reviews')) || [];
            fetch('demodata/sample-reviews.json')
                .then(response => response.json())
                .then(sampleReviews => {
                    reviews = [...sampleReviews, ...localReviews];
                    if (reviews.length > 0) {
                        currentIndex = Math.floor(Math.random() * reviews.length);
                        renderReview(currentIndex);
                        startSlideshow();
                    } else {
                        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to leave one!</p>';
                    }
                });
        };

        loadReviews();

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : reviews.length - 1;
            renderReview(currentIndex);
            startSlideshow();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < reviews.length - 1) ? currentIndex + 1 : 0;
            renderReview(currentIndex);
            startSlideshow();
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'reviews') {
                loadReviews();
            }
        });
    }
});