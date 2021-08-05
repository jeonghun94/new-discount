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

/***/ "./src/client/js/cameraPlayer.js":
/*!***************************************!*\
  !*** ./src/client/js/cameraPlayer.js ***!
  \***************************************/
/***/ (() => {

eval("var canvas = document.getElementsByTagName('canvas');\nvar chanel1 = document.getElementById('chanel1');\nvar chanel2 = document.getElementById('chanel2');\nvar chanel3 = document.getElementById('chanel3');\nvar websocket1 = new WebSocket(\"ws://59.15.58.143:9001\");\nvar websocket2 = new WebSocket(\"ws://59.15.58.143:9002\");\nvar websocket3 = new WebSocket(\"ws://59.15.58.143:9003\");\nvar player1 = new jsmpeg(websocket1, {\n  canvas: chanel1,\n  autoplay: true,\n  loop: true\n});\nvar player2 = new jsmpeg(websocket2, {\n  canvas: chanel2,\n  autoplay: true,\n  loop: true\n});\nvar player3 = new jsmpeg(websocket3, {\n  canvas: chanel3,\n  autoplay: true,\n  loop: true\n});\n\nfor (var i = 0; i < canvas.length; i++) {\n  (function (j) {\n    var idx = canvas[j];\n\n    idx.ondblclick = function () {\n      if (idx.requestFullScreen) {\n        idx.requestFullScreen();\n      } else if (idx.webkitRequestFullScreen) {\n        idx.webkitRequestFullScreen();\n      } else if (idx.mozRequestFullScreen) {\n        idx.mozRequestFullScreen();\n      }\n    };\n  })(i);\n}\n\n//# sourceURL=webpack://node_web/./src/client/js/cameraPlayer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/cameraPlayer.js"]();
/******/ 	
/******/ })()
;