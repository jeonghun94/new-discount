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

eval("window.onload = function () {\n  if (window.location.pathname === \"/password\") {\n    var updBtn = document.querySelector(\"#updBtn\");\n    document.querySelector(\"#oldPassword\").focus();\n    updBtn.addEventListener(\"click\", userPasswordUpdate);\n  }\n};\n\nfunction nodata(container) {\n  var noDataContainer = document.createElement(\"div\");\n  noDataContainer.classList.add(\"nodata__container\");\n  var icon = document.createElement(\"i\");\n  icon.classList.add(\"fas\", \"fa-exclamation\");\n  var p = document.createElement(\"p\");\n  p.innerText = \"조회된 내역이 없습니다.\";\n  noDataContainer.appendChild(icon);\n  noDataContainer.appendChild(p);\n  container.append(noDataContainer);\n}\n\nfunction userPasswordUpdate() {\n  var newPasswordCheck = document.getElementById(\"newPasswordCheck\").value;\n  var newPassword = document.getElementById(\"newPassword\").value;\n  var oldPassword = document.getElementById(\"oldPassword\").value;\n\n  if (oldPassword == null || newPassword == null || newPasswordCheck == null || oldPassword == \"\" || newPassword == \"\" || newPasswordCheck == \"\") {\n    alert(\"모든 항목을 채워주세요.\");\n    return false;\n  } else {\n    if (newPassword !== newPasswordCheck) {\n      alert(\"새로운 비밀번호가 일치하지 않습니다.\");\n      return false;\n    } else {\n      fetch(\"/password\", {\n        method: \"PUT\",\n        headers: {\n          \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify({\n          oldPassword: oldPassword,\n          newPassword: newPassword\n        })\n      }).then(function (res) {\n        return res.json();\n      }).then(function (data) {\n        console.log(data);\n\n        if (data.result === \"success\") {\n          alert(\"비밀번호가 변경되었습니다.\");\n          window.location.href = \"/\";\n        } else {\n          alert(\"비밀번호 변경에 실패하였습니다.\", \"\\uC0AC\\uC720: \".concat(data.msg));\n          return false;\n        }\n      });\n    }\n  }\n}\n\n//# sourceURL=webpack://node_web/./src/client/js/common.js?");

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