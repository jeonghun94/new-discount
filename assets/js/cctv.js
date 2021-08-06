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

eval("var canvas = document.getElementsByTagName('canvas');\nvar wrapper = document.querySelector(\".swiper-wrapper\");\nvar CCTV_INFO = document.querySelector(\"#cctvInfo\");\nvar CCTV_CNT = CCTV_INFO.dataset.cnt;\nvar SERVER_IP = CCTV_INFO.dataset.ip;\n\nfor (var _i = 1; _i <= CCTV_CNT; _i++) {\n  var div = document.createElement(\"div\");\n\n  var _canvas = document.createElement(\"canvas\");\n\n  _canvas.id = \"chanel\" + _i;\n  div.className = \"swiper-slide\";\n  div.append(_canvas);\n  wrapper.append(div);\n  new jsmpeg(new WebSocket(\"ws://\" + SERVER_IP + \":900\" + _i), {\n    canvas: document.getElementById(\"chanel\" + _i),\n    autoplay: true,\n    loop: true\n  });\n}\n\nfor (var i = 0; i < canvas.length; i++) {\n  (function (j) {\n    var idx = canvas[j];\n\n    idx.ondblclick = function () {\n      if (idx.requestFullScreen) {\n        idx.requestFullScreen();\n      } else if (idx.webkitRequestFullScreen) {\n        idx.webkitRequestFullScreen();\n      } else if (idx.mozRequestFullScreen) {\n        idx.mozRequestFullScreen();\n      }\n    };\n  })(i);\n}\n\n//# sourceURL=webpack://node_web/./src/client/js/cctv.js?");

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