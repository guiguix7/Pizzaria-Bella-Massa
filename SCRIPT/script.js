(function () {
    var carouselEl = document.querySelector('#carouselExampleIndicators');
    if (!carouselEl || typeof window.bootstrap === 'undefined' || !bootstrap.Carousel) return;

    var instance = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
        interval: 5000,
    });

    instance.cycle();
})();
