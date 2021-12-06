import Swal from 'sweetalert2'

const items = document.querySelectorAll(".content-item");
let idx = '@01';
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
    idx = "@0" + parseInt(swiper.realIndex + 1);
});

window.onload = function () {
  
  for(var i=0; i<items.length; i++){
    items[i].addEventListener("click", function () {
      const action = this.getAttribute("data-action");
      fetch(`/gate/gate${idx}${action}`, { method: "GET" })
          .then(res => res.json())
          .then(res => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'center-center',
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });

            if (res.res) {
              Toast.fire({
                icon: 'success',
                title: `차단기를 ${res.action}습니다.`
              });
            } else {
              Toast.fire({
                icon: 'error',
                title: `통신이 원할하지 않습니다!\n차단기를 작동하지 못했습니다.`
              });
            }
            
          });

    });
  }

}




