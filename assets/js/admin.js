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

/***/ "./src/client/js/admin.js":
/*!********************************!*\
  !*** ./src/client/js/admin.js ***!
  \********************************/
/***/ (() => {

eval("function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar coupon = document.querySelector(\"#searchCouponList\");\nvar shop = document.querySelector(\"#searchShopList\");\nvar SUB_MENU = document.querySelector(\"nav\");\nvar INS_BTN = document.querySelector(\"#insBtn\");\nvar SEARCH_BTN = document.querySelector(\"#searchBtn\");\nvar TABLE_ROWS = document.querySelector(\"table tbody\");\nvar UPLOAD_BTN = document.querySelector(\"#uploadBtn\");\nvar file = document.querySelector(\"#file\");\nvar fileName = document.querySelector(\"#fileName\");\n\nwindow.onload = function () {\n  if (window.location.pathname === \"/admin/sale-coupon\") {\n    menuActive();\n    coupon.disabled = true;\n    shop.disabled = true;\n    var radio = document.querySelectorAll(\"input[type=radio]\");\n    var radioLength = radio.length;\n\n    for (var i = 0; i < radioLength; i++) {\n      radio[i].addEventListener(\"change\", function () {\n        radioChange(this.id);\n      });\n    }\n  }\n\n  var cnt = document.querySelector(\"#couponCnt\");\n  cnt.addEventListener(\"keyup\", function () {\n    format(this);\n  });\n  file.addEventListener(\"change\", function () {\n    fileName.value = file.value;\n  });\n  UPLOAD_BTN.addEventListener(\"click\", function () {\n    if (fileName.value === \"\") {\n      alert(\"파일을 선택해주세요.\");\n      return;\n    } else {\n      var fileExtension = getFileExtension(fileName.value);\n\n      if (fileExtension !== \"xlsx\") {\n        alert(\"엑셀(.xlsx) 파일만 업로드 가능합니다.\");\n        return;\n      }\n\n      var searchObj = searchValueObj();\n      var data = new FormData();\n      data.append(\"file\", file.files[0]);\n      data.append(\"startDate\", searchObj.startDate);\n      data.append(\"endDate\", searchObj.endDate);\n      data.append(\"type\", searchObj.type);\n      data.append(\"typeValue\", searchObj.typeValue);\n      fetch(\"/admin/sale-coupon\", {\n        method: \"POST\",\n        body: data\n      }).then(function (response) {\n        return response.json();\n      }).then(function (data) {\n        console.log(data);\n        var result = data.saleCouponList;\n        rerenderRows(result);\n      }).catch(function (error) {\n        return console.log(error);\n      });\n    }\n  });\n};\n\nSEARCH_BTN.addEventListener(\"click\", saleCouponHistory);\nINS_BTN.addEventListener(\"click\", function () {\n  var shop = document.querySelector(\"#shopCode\");\n  var type = document.querySelector(\"#couponType\");\n  var cnt = document.querySelector(\"#couponCnt\");\n\n  if (cnt.value === \"\" || cnt.value === null) {\n    alert(\"등록 수량을 입력해 주세요.\");\n    return;\n  }\n\n  var shopValue = shop.options[shop.selectedIndex].value;\n  var typeValue = type.options[type.selectedIndex].value;\n  var shopText = shop.options[shop.selectedIndex].text;\n  var typeText = type.options[type.selectedIndex].text;\n\n  if (confirm(\"\".concat(typeText, \" \\uD560\\uC778\\uAD8C \").concat(cnt.value, \"\\uAC1C\\uB97C\\n\").concat(shopText, \"\\uC5D0 \\uB4F1\\uB85D\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\"))) {\n    addSaleCouponList({\n      shopCode: shopValue,\n      couponType: typeValue,\n      stock: cnt.value\n    });\n  } else {\n    alert(\"취소되었습니다.\");\n  }\n});\n\nfunction getFileExtension(filename) {\n  var fileLength = filename.length;\n  var lastDot = filename.lastIndexOf(\".\");\n  var fileExtension = filename.substring(lastDot + 1, fileLength).toLowerCase();\n  return fileExtension;\n}\n\nfunction searchValueObj() {\n  var startDate = document.querySelector(\"#startDate\").value.replace(/-/gi, \"\");\n  var endDate = document.querySelector(\"#endDate\").value.replace(/-/gi, \"\");\n  var type = document.querySelector('input[name=\"searchType\"]:checked').id;\n  var typeValue = \"\";\n\n  if (type === \"shop\") {\n    typeValue = document.querySelector(\"#searchShopList\").value;\n  } else if (type === \"coupon\") {\n    typeValue = document.querySelector(\"#searchCouponList\").value;\n  }\n\n  return {\n    startDate: startDate,\n    endDate: endDate,\n    type: type,\n    typeValue: typeValue\n  };\n}\n\nfunction saleCouponHistory() {\n  var searchObj = searchValueObj();\n  fetch(\"/admin/sale-coupon?startDate=\".concat(searchObj.startDate, \"&endDate=\").concat(searchObj.endDate, \"&type=\").concat(searchObj.type, \"&typeValue=\").concat(searchObj.typeValue), {\n    method: \"GET\"\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    var result = data.saleCouponList;\n    rerenderRows(result);\n  }).catch(function (error) {\n    return console.log(error);\n  });\n}\n\nfunction addSaleCouponList(obj) {\n  console.log(JSON.stringify(obj));\n  var startDate = document.querySelector(\"#startDate\").value.replace(/-/gi, \"\");\n  var endDate = document.querySelector(\"#endDate\").value.replace(/-/gi, \"\");\n  var type = document.querySelector('input[name=\"searchType\"]:checked').id;\n  obj = _objectSpread(_objectSpread({}, obj), {}, {\n    startDate: startDate,\n    endDate: endDate,\n    type: type\n  });\n  fetch(\"/admin/sale-coupon\", {\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n    body: JSON.stringify(obj)\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    var result = data.saleCouponList;\n    rerenderRows(result);\n  }).catch(function (error) {\n    return console.log(error);\n  });\n}\n\nfunction rerenderRows(data) {\n  while (TABLE_ROWS.hasChildNodes()) {\n    TABLE_ROWS.removeChild(TABLE_ROWS.firstChild);\n  }\n\n  if (data.length > 0) {\n    data.map(function (x) {\n      var newRow = TABLE_ROWS.insertRow();\n      newRow.insertCell(0).innerText = x.shopName;\n      newRow.insertCell(1).innerText = x.dcName;\n      newRow.insertCell(2).innerText = x.saleCouponQty;\n      newRow.insertCell(3).innerText = x.saleCouponAmt;\n      newRow.insertCell(4).innerText = x.insDate;\n    });\n  } else {\n    var tr = document.createElement(\"tr\");\n    var td = document.createElement(\"td\");\n    td.setAttribute(\"colspan\", \"100%\");\n    td.innerText = \"조회된 데이터가 없습니다.\";\n    td.classList.add(\"not__found\");\n    tr.appendChild(td);\n    TABLE_ROWS.appendChild(tr);\n  }\n}\n\nfunction format(obj) {\n  obj.value = comma(uncomma(obj.value));\n}\n\nfunction comma(str) {\n  str = String(str);\n  var minus = str.substring(0, 1);\n  str = str.replace(/[^\\d]+/g, \"\");\n  str = str.replace(/(\\d)(?=(?:\\d{3})+(?!\\d))/g, \"$1,\");\n  if (minus == \"-\") str = \"-\" + str;\n  return str;\n}\n\nfunction commaToString(price) {\n  return price.toString().replace(/\\B(?<!\\.\\d*)(?=(\\d{3})+(?!\\d))/g, \",\");\n}\n\nfunction uncomma(str) {\n  str = String(str);\n  var minus = str.substring(0, 1);\n  str = str.replace(/[^\\d]+/g, \"\");\n  if (minus == \"-\") str = \"-\" + str;\n  return str;\n}\n\nfunction menuActive() {\n  var pathName = document.location.pathname.split(\".\")[0];\n\n  for (var i = 0; i < SUB_MENU.children.length; i++) {\n    var menu = SUB_MENU.children[i];\n\n    if (pathName === menu.dataset.path) {\n      menu.classList.add(\"nav-active\");\n    }\n  }\n}\n\nfunction radioChange(val) {\n  switch (val) {\n    case \"all\":\n      coupon.disabled = true;\n      shop.disabled = true;\n      break;\n\n    case \"shop\":\n      coupon.disabled = false;\n      shop.disabled = false;\n      coupon.style.display = \"none\";\n      shop.style.display = \"block\";\n      break;\n\n    case \"coupon\":\n      coupon.disabled = false;\n      shop.disabled = false;\n      coupon.style.display = \"block\";\n      shop.style.display = \"none\";\n      break;\n\n    default:\n      break;\n  }\n}\n\n//# sourceURL=webpack://node_web/./src/client/js/admin.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/admin.js"]();
/******/ 	
/******/ })()
;