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

eval("function nodata(container) {\n  var noDataContainer = document.createElement(\"div\");\n  noDataContainer.classList.add(\"nodata__container\");\n  var icon = document.createElement(\"i\");\n  icon.classList.add(\"fas\", \"fa-exclamation\");\n  var p = document.createElement(\"p\");\n  p.innerText = \"조회된 내역이 없습니다.\";\n  noDataContainer.appendChild(icon);\n  noDataContainer.appendChild(p);\n  container.append(noDataContainer);\n}\n\n//# sourceURL=webpack://node_web/./src/client/js/common.js?");

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