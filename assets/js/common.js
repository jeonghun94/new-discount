/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/common.js":
/*!*********************************!*\
  !*** ./src/client/js/common.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"menuActive\": () => (/* binding */ menuActive),\n/* harmony export */   \"radioInit\": () => (/* binding */ radioInit),\n/* harmony export */   \"getFileExtension\": () => (/* binding */ getFileExtension),\n/* harmony export */   \"format\": () => (/* binding */ format)\n/* harmony export */ });\nvar SUB_MENU = document.querySelector(\"nav\");\n\nwindow.onload = function () {\n  if (window.location.pathname === \"/password\") {\n    var updBtn = document.querySelector(\"#updBtn\");\n    document.querySelector(\"#oldPassword\").focus();\n    updBtn.addEventListener(\"click\", userPasswordUpdate);\n  }\n\n  var table = document.querySelector(\"#historyTable tbody\");\n  var rows = table.querySelectorAll(\"tr\");\n  var tableRows = [];\n  var formShopDuplication = document.querySelector(\"#formShopDuplication\");\n  var formTimeLimit = document.querySelector(\"#formTimeLimit\");\n  var formTimeLimitMinutes = document.querySelector(\"#formTimeLimitMinutes\");\n  var formMaxCnt = document.querySelector(\"#formMaxCnt\");\n  var formFreeCnt = document.querySelector(\"#formFreeCnt\");\n  var formPayCnt = document.querySelector(\"#formPayCnt\");\n\n  var _loop = function _loop(i) {\n    tableRows.push(rows[i]);\n    rows[i].addEventListener(\"click\", function (e) {\n      var row = rows[i];\n      row.style.backgroundColor = \"#f8981c\";\n      row.style.color = \"white\"; // const shopCode = rows[i].querySelector(\"td:nth-child(1) > input\").value;\n      // const shopName = row.querySelector(\"td:nth-child(2)\").innerText;\n\n      var shopDuplication = row.querySelector(\"td:nth-child(3)\").innerText;\n      var timeLimit = row.querySelector(\"td:nth-child(4)\").innerText;\n      var timeLimitMinutes = row.querySelector(\"td:nth-child(5)\").innerText;\n      var maxCnt = row.querySelector(\"td:nth-child(6)\").innerText;\n      var freeCnt = row.querySelector(\"td:nth-child(7)\").innerText;\n      var payCnt = row.querySelector(\"td:nth-child(8)\").innerText;\n      formShopDuplication.value = shopDuplication === \"\" ? \"N\" : shopDuplication;\n      formTimeLimit.value = timeLimit === \"\" ? \"N\" : timeLimit;\n      formTimeLimitMinutes.value = timeLimitMinutes === \"\" ? \"0\" : timeLimitMinutes;\n      formMaxCnt.value = maxCnt === \"\" ? \"2\" : maxCnt;\n      formFreeCnt.value = freeCnt === \"\" ? \"1\" : freeCnt;\n      formPayCnt.value = payCnt === \"\" ? \"1\" : payCnt;\n    });\n  };\n\n  for (var i = 0; i < rows.length; i++) {\n    _loop(i);\n  }\n};\n\nvar checkbox1 = document.querySelector(\"#selectAll\");\ndocument.getElementById(\"selectAll\").onchange = selectAll;\n\nfunction selectAll() {\n  var checkboxes = document.getElementsByName(\"user\");\n  checkboxes.forEach(function (checkbox) {\n    checkbox.checked = checkbox1.checked;\n  });\n} // 관리자 페이지 메뉴 활성화\n\n\nvar menuActive = function menuActive() {\n  var pathName = document.location.pathname.split(\".\")[0];\n\n  for (var i = 0; i < SUB_MENU.children.length; i++) {\n    var menu = SUB_MENU.children[i];\n\n    if (pathName === menu.dataset.path) {\n      menu.classList.add(\"nav-active\");\n    }\n  }\n};\nvar radioInit = function radioInit(radioChange) {\n  var radio = document.querySelectorAll(\"input[type=radio]\");\n  var radioLength = radio.length;\n\n  for (var i = 0; i < radioLength; i++) {\n    radio[i].addEventListener(\"change\", function () {\n      radioChange(this.id);\n    });\n  }\n}; // 파일 업로드시 확장자 체크\n\nvar getFileExtension = function getFileExtension(fileName) {\n  var fileLength = fileName.length;\n  var lastDot = fileName.lastIndexOf(\".\");\n  var fileExtension = fileName.substring(lastDot + 1, fileLength).toLowerCase();\n  return fileExtension;\n};\nvar format = function format(obj) {\n  obj.value = comma(uncomma(obj.value));\n};\n\nfunction comma(str) {\n  str = String(str);\n  var minus = str.substring(0, 1);\n  str = str.replace(/[^\\d]+/g, \"\");\n  str = str.replace(/\\B(?=(\\d{3})+(?!\\d))/g, \",\");\n  if (minus == \"-\") str = \"-\" + str;\n  return str;\n}\n\nfunction uncomma(str) {\n  str = String(str);\n  var minus = str.substring(0, 1);\n  str = str.replace(/[^\\d]+/g, \"\");\n  if (minus == \"-\") str = \"-\" + str;\n  return str;\n} // function commaToString(price) {\n//   return price.toString().replace(/\\B(?<!\\.\\d*)(?=(\\d{3})+(?!\\d))/g, \",\");\n// }\n// 조회 결과 없음 표시\n\n\nfunction nodata(container) {\n  var noDataContainer = document.createElement(\"div\");\n  noDataContainer.classList.add(\"nodata__container\");\n  var icon = document.createElement(\"i\");\n  icon.classList.add(\"fas\", \"fa-exclamation\");\n  var p = document.createElement(\"p\");\n  p.innerText = \"조회된 내역이 없습니다.\";\n  noDataContainer.appendChild(icon);\n  noDataContainer.appendChild(p);\n  container.append(noDataContainer);\n}\n\nfunction userPasswordUpdate() {\n  var newPasswordCheck = document.getElementById(\"newPasswordCheck\").value;\n  var newPassword = document.getElementById(\"newPassword\").value;\n  var oldPassword = document.getElementById(\"oldPassword\").value;\n\n  if (oldPassword == null || newPassword == null || newPasswordCheck == null || oldPassword == \"\" || newPassword == \"\" || newPasswordCheck == \"\") {\n    alert(\"모든 항목을 채워주세요.\");\n    return false;\n  } else {\n    if (newPassword !== newPasswordCheck) {\n      alert(\"새로운 비밀번호가 일치하지 않습니다.\");\n      return false;\n    } else {\n      fetch(\"/password\", {\n        method: \"PUT\",\n        headers: {\n          \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify({\n          oldPassword: oldPassword,\n          newPassword: newPassword\n        })\n      }).then(function (res) {\n        return res.json();\n      }).then(function (data) {\n        console.log(data);\n\n        if (data.result === \"success\") {\n          alert(\"비밀번호가 변경되었습니다.\\n다시 로그인해주세요.\");\n          window.location.href = \"/logout\";\n        } else {\n          alert(\"\\uBE44\\uBC00\\uBC88\\uD638 \\uBCC0\\uACBD\\uC5D0 \\uC2E4\\uD328\\uD558\\uC600\\uC2B5\\uB2C8\\uB2E4.\\n\\uC0AC\\uC720: \".concat(data.msg));\n          return false;\n        }\n      });\n    }\n  }\n}\n\n//# sourceURL=webpack://node_web/./src/client/js/common.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/common.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;