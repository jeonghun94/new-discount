let swiper = new Swiper(".mySwiper", {
    effect: "cube",
    grabCursor: true,
    cubeEffect: {
        shadow: false,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
    },
    pagination: {
        el: ".swiper-pagination",
    },
});

swiper.on('transitionEnd', function () {
    const idx = "0" + parseInt(swiper.realIndex + 1);
    console.log(idx);
});
