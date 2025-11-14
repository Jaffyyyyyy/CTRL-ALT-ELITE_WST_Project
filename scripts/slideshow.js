document.addEventListener('DOMContentLoaded', () => {
    const slideshowWidgets = document.querySelectorAll('.slideshow-widget');

    slideshowWidgets.forEach(slideshowContainer => {
        const images = slideshowContainer.querySelectorAll('.slideshow-image');
        let currentImageIndex = 0;

        if (images.length > 0) {
            images[currentImageIndex].classList.add('active');

            setInterval(() => {
                images[currentImageIndex].classList.remove('active');
                currentImageIndex = (currentImageIndex + 1) % images.length;
                images[currentImageIndex].classList.add('active');
            }, 5000);
        }
    });
});