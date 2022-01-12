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

/***/ "./src/client/js/common.js":
/*!*********************************!*\
  !*** ./src/client/js/common.js ***!
  \*********************************/
/***/ (() => {

eval("function nodata(container) {\r\n  const noDataContainer = document.createElement(\"div\");\r\n  noDataContainer.classList.add(\"nodata__container\");\r\n\r\n  const icon = document.createElement(\"i\");\r\n  icon.classList.add(\"fas\", \"fa-exclamation\");\r\n\r\n  const p = document.createElement(\"p\");\r\n  p.innerText = \"조회된 내역이 없습니다.\";\r\n\r\n  noDataContainer.appendChild(icon);\r\n  noDataContainer.appendChild(p);\r\n\r\n  container.append(noDataContainer);\r\n}\r\n\n\n//# sourceURL=webpack://node_web/./src/client/js/common.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/common.js"]();
/******/ 	
/******/ })()
;