document.addEventListener('DOMContentLoaded', () => {
    const reviewModalElement = document.getElementById('reviewModal');
    if (!reviewModalElement) return;

    const stars = reviewModalElement.querySelectorAll('#star-rating .star-icon');
    let rating = 0;

    const outlineStarPath = 'M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z';
    
    const filledStarPath = 'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z';

    const quotesByRating = {
        1: [
            "Not what I expected.",
            "Room for improvement.",
            "Disappointing experience."
        ],
        2: [
            "Could be better.",
            "Needs some work.",
            "Below average service."
        ],
        3: [
            "It was okay.",
            "Average experience.",
            "Met basic expectations."
        ],
        4: [
            "Good service overall!",
            "Very satisfied!",
            "Would recommend!"
        ],
        5: [
            "Absolutely fantastic!",
            "Exceeded all expectations!",
            "Outstanding service!",
            "I didn't have to wait long at all!",
            "A fantastic experience!",
            "Transparent and easy."
        ]
    };

    const getRandomQuote = (starRating) => {
        const quotes = quotesByRating[starRating];
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    };

    const fillStars = (value) => {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            const pathElement = star.querySelector('path');
            if (starValue <= value) {
                pathElement.setAttribute('d', filledStarPath);
                star.style.color = '#ffc107';
            } else {
                pathElement.setAttribute('d', outlineStarPath);
                star.style.color = '#6c757d';
            }
        });
    };

    const saveReview = () => {
        const comment = document.getElementById('reviewComment').value;
        const myQueueId = parseInt(sessionStorage.getItem('myQueueId'));
        const state = queueService.getState();
        const myCustomer = state.history.find(c => c.id === myQueueId);
        const customerName = myCustomer ? myCustomer.name : "Anonymous";

        if (rating === 0) {
            alert("Please select a star rating before submitting.");
            return;
        }

        const reviewData = {
            name: customerName,
            rating: rating,
            quote: getRandomQuote(rating), 
            comment: comment
        };
        
        let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews.push(reviewData);
        localStorage.setItem('reviews', JSON.stringify(reviews));

        const reviewModal = bootstrap.Modal.getInstance(reviewModalElement);
        reviewModal.hide();

        rating = 0;
        document.getElementById('reviewComment').value = '';
        fillStars(0);
    };

    stars.forEach(star => {
        star.style.cursor = 'pointer';
        star.style.transition = 'color 0.2s ease, transform 0.1s ease';
        
        star.addEventListener('mouseover', () => {
            const hoverValue = parseInt(star.getAttribute('data-value'));
            fillStars(hoverValue);
            star.style.transform = 'scale(1.1)';
        });

        star.addEventListener('mouseout', () => {
            fillStars(rating);
            star.style.transform = 'scale(1)';
        });

        star.addEventListener('click', () => {
            rating = parseInt(star.getAttribute('data-value'));
            fillStars(rating); 
        });
    });

    const submitReviewBtn = document.getElementById('submit-review-btn');
    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', saveReview);
    }

    fillStars(0);
});