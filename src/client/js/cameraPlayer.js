
const canvas = document.getElementsByTagName('canvas');

const chanel1 = document.getElementById('chanel1');
const chanel2 = document.getElementById('chanel2');
const chanel3 = document.getElementById('chanel3');


const player1 = new jsmpeg(websocket1, {
    canvas: chanel1,
    autoplay: true,
    loop: true
})

const player2 = new jsmpeg(websocket2, {
    canvas: chanel2,
    autoplay: true,
    loop: true
})

const player3 = new jsmpeg(websocket3, {
    canvas: chanel3,
    autoplay: true,
    loop: true
})


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
