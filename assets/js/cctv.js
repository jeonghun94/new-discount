/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/cctv.js":
/*!*******************************!*\
  !*** ./src/client/js/cctv.js ***!
  \*******************************/
/***/ (() => {

eval("const canvas = document.getElementsByTagName('canvas');\r\nconst wrapper = document.querySelector(\".swiper-wrapper\");\r\n\r\nconst CCTV_INFO = document.querySelector(\"#cctvInfo\");\r\nconst CCTV_CNT = CCTV_INFO.dataset.cnt;\r\nconst SERVER_IP = CCTV_INFO.dataset.ip;\r\n\r\nfor (let i = 1; i <= CCTV_CNT; i++) {\r\n    const div = document.createElement(\"div\");\r\n    const canvas = document.createElement(\"canvas\");\r\n    canvas.id = \"chanel\" + i;\r\n    div.className = \"swiper-slide\";\r\n    div.append(canvas);\r\n    wrapper.append(div);\r\n\r\n    // new jsmpeg(new WebSocket(\"ws://localhost:900\"+i), {\r\n    new jsmpeg(new WebSocket(\"ws://\"+SERVER_IP+\":900\"+i), {\r\n        canvas: document.getElementById(\"chanel\"+i),\r\n        autoplay: true,\r\n        loop: true\r\n    })\r\n}\r\n\r\nfor (var i = 0; i < canvas.length; i++) {\r\n    (function (j) {\r\n        const idx = canvas[j];\r\n        idx.ondblclick = function() {\r\n            if (idx.requestFullScreen) {\r\n                idx.requestFullScreen();\r\n            } else if (idx.webkitRequestFullScreen) {\r\n                idx.webkitRequestFullScreen();\r\n            } else if (idx.mozRequestFullScreen) {\r\n                idx.mozRequestFullScreen();\r\n            }\r\n        }\r\n    })(i);\r\n}\r\n\n\n//# sourceURL=webpack://node_web/./src/client/js/cctv.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/cctv.js"]();
/******/ 	
/******/ })()
;