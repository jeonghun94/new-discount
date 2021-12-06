import Swal from 'sweetalert2'

const items = document.getElementsByClassName("content-item");

function action() {
  for(var i=0; i<items.length; i++){
    (function(i){
      items[i].addEventListener("click", a);
      function a() {
        fetch(`/gate/${items[i].dataset.action}`, { method: "GET" })
          .then(res => res.json())
          .then(res => {
            console.log(res.re);

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
      }
    })(i);
  }
}

action();