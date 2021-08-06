const canvas = document.getElementsByTagName('canvas');
const wrapper = document.querySelector(".swiper-wrapper");

const CCTV_INFO = document.querySelector("#cctvInfo");
const CCTV_CNT = CCTV_INFO.dataset.cnt;
const SERVER_IP = CCTV_INFO.dataset.ip;

for (let i = 1; i <= CCTV_CNT; i++) {
    const div = document.createElement("div");
    const canvas = document.createElement("canvas");
    canvas.id = "chanel" + i;
    div.className = "swiper-slide";
    div.append(canvas);
    wrapper.append(div);

    new jsmpeg(new WebSocket("ws://"+SERVER_IP+":900"+i), {
        canvas: document.getElementById("chanel"+i),
        autoplay: true,
        loop: true
    })
}

for (var i = 0; i < canvas.length; i++) {
    (function (j) {
        const idx = canvas[j];
        idx.ondblclick = function() {
            if (idx.requestFullScreen) {
                idx.requestFullScreen();
            } else if (idx.webkitRequestFullScreen) {
                idx.webkitRequestFullScreen();
            } else if (idx.mozRequestFullScreen) {
                idx.mozRequestFullScreen();
            }
        }
    })(i);
}
