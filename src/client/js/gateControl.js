import Swal from 'sweetalert2'

// const socket = new WebSocket('ws://192.168.4.101:10000');

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

//websocket


//swiper
swiper.on('transitionEnd', function () {
    idx = "@0" + parseInt(swiper.realIndex + 1);
});

// socket.onopen = function () {
//   console.log('연결 완료');
// };

// socket.onmessage = function () {
//   //sendMessage();
// };

window.onload = function () {
  
  for(var i=0; i<items.length; i++){
    items[i].addEventListener("click", function () {
      const action = this.getAttribute("data-action");
        //socket.send(`gate${idx}${action}`);
        // socket.send(JSON.stringify(`gate${idx} ${action}`));
      
      
      fetch(`/gate/gate${idx}${action}`, { method: "GET" })
          .then(res => res.json())
          .then(res => {
            //console.log(res.re);
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

            if (res.re) {
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




