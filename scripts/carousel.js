document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.hero-carousel-item');
    if (items.length === 0) return;

    let currentIndex = 0;
    const slideInterval = 5000;
    const transitionDuration = 1500;

    items[currentIndex].classList.add('active');

    setInterval(() => {
        const previousIndex = currentIndex;
        currentIndex = (currentIndex + 1) % items.length;

        const prevItem = items[previousIndex];
        const nextItem = items[currentIndex];

        prevItem.classList.add('exiting');
        prevItem.classList.remove('active');
        nextItem.classList.add('active');

        setTimeout(() => {
            prevItem.classList.remove('exiting');
        }, transitionDuration);

    }, slideInterval);
});
