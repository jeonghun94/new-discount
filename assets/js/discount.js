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

/***/ "./src/client/js/discount.js":
/*!***********************************!*\
  !*** ./src/client/js/discount.js ***!
  \***********************************/
/***/ (() => {

eval("var LIST_DIV = document.querySelector(\"#listDiv\");\nvar searchBtn = document.querySelector(\"#searchBtn\");\nvar inCarNo = document.querySelector(\"#inCarNo\");\n\nfunction checkVal(obj) {\n  obj.value = obj.value.replace(/[^0-9]/g, \"\");\n}\n\nfunction appendSearchList(result) {\n  LIST_DIV.innerHTML = \"\";\n\n  if (result.length !== 0) {\n    for (var i = 0; i < result.length; i++) {\n      var container = document.createElement(\"div\");\n      container.classList.add(\"search__container\");\n      container.dataset.inseqno = result[i].inSeqNo;\n      var img = document.createElement(\"img\");\n      img.classList.add(\"search__img\");\n      img.src = \"http://smcity.iptime.org/\".concat(result[i].inCarPicName);\n      img.alt = \"이미지를 불러오지 못했습니다.\";\n      img.width = \"30px\";\n      img.height = \"30px\";\n      var info = document.createElement(\"div\");\n      info.classList.add(\"search__info\");\n\n      var _inCarNo = document.createElement(\"p\");\n\n      _inCarNo.innerText = result[i].inCarNo;\n      var tkType = document.createElement(\"p\");\n      tkType.innerText = \"\\uC785\\uCC28\\uC885\\uB958: \".concat(result[i].tkType);\n      var unitName = document.createElement(\"p\");\n      unitName.innerText = \"\\uC785\\uCC28\\uC7A5\\uBE44: \".concat(result[i].unitName);\n      var insDate = document.createElement(\"p\");\n      insDate.innerText = \"\\uC785\\uCC28\\uC2DC\\uAC04: \".concat(result[i].insDate.substring(5, result[i].insDate.length - 3));\n      info.appendChild(_inCarNo);\n      info.appendChild(tkType);\n      info.appendChild(unitName);\n      info.appendChild(insDate);\n      container.appendChild(img);\n      container.appendChild(info);\n      LIST_DIV.append(container);\n    }\n  } else {\n    var _container = document.createElement(\"div\");\n\n    _container.classList.add(\"test\"); // container.classList.add(\"no__data\");\n\n\n    var icon = document.createElement(\"div\");\n    icon.classList.add(\"no__data\");\n    var text = document.createElement(\"p\");\n    text.innerText = \"조회된 차량이 없습니다.\";\n\n    _container.appendChild(icon);\n\n    _container.appendChild(text);\n\n    LIST_DIV.append(_container);\n  }\n}\n\nfunction searchInCar() {\n  if (inCarNo.value.length === 4) {\n    fetch(\"/discount/search\", {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      body: JSON.stringify({\n        inCarNo: inCarNo.value\n      })\n    }).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      var result = data.result;\n      appendSearchList(result);\n    }).catch(function (error) {\n      return console.log(error);\n    });\n  } else {\n    alert(\"차량번호는 4자리이어야 합니다.\");\n  }\n}\n\nsearchBtn.addEventListener(\"click\", searchInCar);\ninCarNo.addEventListener(\"keyup\", function (e) {\n  if (window.event.keyCode == 13) {\n    searchInCar();\n  }\n});\n\nwindow.onload = function () {\n  console.log(\"8090\");\n  inCarNo.focus();\n};\n\n//# sourceURL=webpack://node_web/./src/client/js/discount.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/discount.js"]();
/******/ 	
/******/ })()
;