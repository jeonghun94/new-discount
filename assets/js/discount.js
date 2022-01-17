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

eval("var SEARCH_ARTICLE = document.querySelector(\"#searchArticle\");\nvar CRUD_ARTICLE = document.querySelector(\"#crudArticle\");\nvar LIST_DIV = document.querySelector(\"#listDiv\");\nvar searchBtn = document.querySelector(\"#searchBtn\");\nvar preBtn = document.querySelector(\"#preBtn\");\nvar inCarNo = document.querySelector(\"#inCarNo\");\nvar COUPON_CONTAINER = document.createElement(\"div\");\nCOUPON_CONTAINER.classList.add(\"coupon__container\");\nCOUPON_CONTAINER.id = \"couponContainer\";\nvar DISCOUNT_CONTAINER = document.createElement(\"div\");\nDISCOUNT_CONTAINER.classList.add(\"discount__container\"); //숫자만 입력받기\n\nfunction checkVal() {\n  this.value = this.value.replace(/[^0-9]/g, \"\");\n} //차량조회 돌아가기\n\n\nfunction backToSearch() {\n  SEARCH_ARTICLE.style.display = \"block\";\n  CRUD_ARTICLE.style.display = \"none\";\n  CRUD_ARTICLE.querySelector(\".search__container\").remove();\n  CRUD_ARTICLE.querySelector(\".coupon__container\").remove();\n  COUPON_CONTAINER.innerHTML = \"\";\n  DISCOUNT_CONTAINER.innerHTML = \"\";\n} //조히내역 없음\n\n\nfunction notFound(container) {\n  var notFoundContainer = document.createElement(\"div\");\n  notFoundContainer.classList.add(\"nodata__container\");\n  var icon = document.createElement(\"i\");\n  icon.classList.add(\"fas\", \"fa-exclamation\");\n  var p = document.createElement(\"p\");\n  p.innerText = \"조회된 내역이 없습니다.\";\n  notFoundContainer.appendChild(icon);\n  notFoundContainer.appendChild(p);\n  container.append(notFoundContainer);\n} //차량조회 리스트 추가\n\n\nfunction appendSearchList(result) {\n  LIST_DIV.innerHTML = \"\";\n\n  if (result.length !== 0) {\n    for (var i = 0; i < result.length; i++) {\n      var container = document.createElement(\"div\");\n      container.classList.add(\"search__container\");\n      container.dataset.inseqno = result[i].inSeqNo;\n      var img = document.createElement(\"img\");\n      img.classList.add(\"search__img\");\n      img.src = \"\".concat(\"http://smcity.iptime.org\", \":\").concat(\"80\", \"/\").concat(result[i].inCarPicName);\n      img.alt = \"이미지를 불러오지 못했습니다.\";\n      var info = document.createElement(\"div\");\n      info.classList.add(\"search__info\");\n\n      var _inCarNo = document.createElement(\"p\");\n\n      _inCarNo.innerText = result[i].inCarNo;\n      var tkType = document.createElement(\"p\");\n      tkType.innerText = \"\\uC785\\uCC28\\uC885\\uB958: \".concat(result[i].tkType);\n      var unitName = document.createElement(\"p\");\n      unitName.innerText = \"\\uC785\\uCC28\\uC7A5\\uBE44: \".concat(result[i].unitName);\n      var insDate = document.createElement(\"p\");\n      insDate.innerText = \"\\uC785\\uCC28\\uC2DC\\uAC04: \".concat(result[i].insDate.substring(5, result[i].insDate.length - 3));\n      info.appendChild(_inCarNo);\n      info.appendChild(tkType);\n      info.appendChild(unitName);\n      info.appendChild(insDate);\n      container.appendChild(img);\n      container.appendChild(info);\n      LIST_DIV.append(container);\n    }\n  } else {\n    notFound(LIST_DIV);\n  }\n\n  var searchInCarByInSeqNo = document.querySelectorAll(\".search__container\");\n  searchInCarByInSeqNo.forEach(function (x) {\n    x.addEventListener(\"click\", function (e) {\n      var inSeqNo = e.currentTarget.dataset.inseqno;\n      var cloneNode = e.currentTarget.cloneNode(true);\n      SEARCH_ARTICLE.style.display = \"none\";\n      CRUD_ARTICLE.style.display = \"block\";\n      searchInSeqNo(inSeqNo, cloneNode);\n    });\n  });\n} //차량조회 테스트\n\n\nfunction searchInCarT() {\n  fetch(\"/search-in-car\", {\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\"\n    }\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    var result = data.result;\n    var testInCarNo = result[0].inCarNo;\n    inCarNo.value = testInCarNo.substring(testInCarNo.length - 4, testInCarNo.length);\n    result.map(function (x, idx) {\n      console.log(\"\".concat(idx + 1, \".\").concat(x.inCarNo));\n    });\n    searchBtn.click();\n  }).catch(function (error) {\n    return console.log(error);\n  });\n} //차량조회(차량번호)\n\n\nfunction searchInCar() {\n  if (inCarNo.value.length === 4) {\n    fetch(\"/discount/search\", {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      body: JSON.stringify({\n        inCarNo: inCarNo.value\n      })\n    }).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      var result = data.result;\n      appendSearchList(result);\n    }).catch(function (error) {\n      return console.log(error);\n    });\n  } else {\n    alert(\"차량번호는 4자리이어야 합니다.\");\n  }\n} //차량조회 + 쿠폰조회 + 할인내역조회\n\n\nfunction searchInSeqNo(inSeqNo, cloneNode) {\n  fetch(\"/discount/search/inseqno\", {\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n    body: JSON.stringify({\n      inSeqNo: inSeqNo\n    })\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    var freeCouponList = data.freeCouponList,\n        payCouponList = data.payCouponList,\n        dList = data.discountList; //조회 내역 복제 및 할인권, 할인내역 Container 추가\n\n    CRUD_ARTICLE.append(cloneNode);\n    CRUD_ARTICLE.querySelector(\".search__container\").style.border = \"none\";\n    CRUD_ARTICLE.append(COUPON_CONTAINER);\n    CRUD_ARTICLE.append(DISCOUNT_CONTAINER); //할인권 리스트 추가\n\n    couponList(freeCouponList, \"무료\");\n    couponList(payCouponList, \"유료\");\n    couponInvalid(); //할인내역 리스트 추가\n\n    discountList(dList, inSeqNo);\n  }).catch(function (error) {\n    return console.log(error);\n  });\n} //할인내역 추가\n\n\nfunction discountList(list, inSeqNo) {\n  if (list.length !== 0) {\n    var discountHeader = document.createElement(\"div\");\n    discountHeader.classList.add(\"discount__header\");\n    discountHeader.innerHTML = \"할인내역\";\n    DISCOUNT_CONTAINER.append(discountHeader);\n    list.map(function (x) {\n      var discountInfoContainer = document.createElement(\"div\");\n      discountInfoContainer.classList.add(\"discount__info-container\");\n      discountInfoContainer.dataset.idx = x.idx;\n      var discountInfo = document.createElement(\"div\");\n      discountInfo.classList.add(\"discount__info\");\n      var discounInfoTitle = document.createElement(\"p\");\n      discounInfoTitle.classList.add(\"discount__info-title\");\n      discounInfoTitle.innerText = \"\".concat(x.dcName, \" \\uD560\\uC778\\uAD8C\");\n      var discountInfoShopName = document.createElement(\"p\");\n      discountInfoShopName.innerText = \"\\uB4F1\\uB85D\\uB9E4\\uC7A5: \".concat(x.shopName);\n      var discountInfoInDate = document.createElement(\"p\");\n      discountInfoInDate.innerText = \"\\uB4F1\\uB85D\\uC77C\\uC2DC: \".concat(x.inTime.substring(0, 10), \" \").concat(x.inTime.substring(11, 19));\n      discountInfo.appendChild(discounInfoTitle);\n      discountInfo.appendChild(discountInfoShopName);\n      discountInfo.appendChild(discountInfoInDate);\n      var discountInfoDelete = document.createElement(\"div\");\n      discountInfoDelete.classList.add(\"discount__info-delete\");\n      discountInfoDelete.innerHTML = \"삭제\";\n      discountInfoDelete.addEventListener(\"click\", function (e) {\n        var idx = e.currentTarget.parentNode.dataset.idx;\n        deleteList(idx, inSeqNo);\n      });\n      discountInfoContainer.appendChild(discountInfo);\n      discountInfoContainer.appendChild(discountInfoDelete);\n      DISCOUNT_CONTAINER.append(discountInfoContainer);\n    });\n  } else {\n    notFound(DISCOUNT_CONTAINER);\n  }\n} //무료권 혹 유료권 2개가 아닐시 명칭 변경\n\n\nfunction couponInvalid() {\n  var coupon = document.querySelectorAll(\".coupon__container-type\");\n\n  if (coupon.length === 1) {\n    coupon[0].querySelector(\"h6\").innerText = \"할인권\";\n  }\n} //할인권 SELECT 추가\n\n\nfunction couponList(list, text) {\n  if (list.length !== 0) {\n    var type = document.createElement(\"div\");\n    type.classList.add(\"coupon__container-type\");\n    var typeText = document.createElement(\"h6\");\n    typeText.innerText = \"\".concat(text, \"\\uAD8C\");\n    var select = document.createElement(\"select\");\n    select.classList.add(\"coupon__list\");\n    var option = document.createElement(\"option\");\n    option.innerText = \"할인권 선택\";\n    option.value = \"00\";\n    select.append(option); //할인권 선택 시 할인 내역 추가\n\n    select.addEventListener(\"change\", function (e) {\n      var inSeqNo = CRUD_ARTICLE.querySelector(\".search__container\").dataset.inseqno;\n      var _e$currentTarget = e.currentTarget,\n          dcName = _e$currentTarget.text,\n          couponType = _e$currentTarget.value;\n\n      if (couponType !== \"00\" && confirm(\"\\uD560\\uC778\\uAD8C\\uC744 \\uB4F1\\uB85D\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\")) {\n        insertList(inSeqNo, couponType);\n      } else {\n        resetSelect();\n      }\n    });\n    list.map(function (x) {\n      var option = document.createElement(\"option\");\n      option.innerText = \"\".concat(x.dcName);\n      option.value = \"\".concat(x.couponType);\n      select.append(option);\n    });\n    type.append(typeText);\n    type.append(select);\n    COUPON_CONTAINER.append(type);\n  }\n}\n\nfunction resetSelect() {\n  var select = document.querySelectorAll(\"select\");\n  select.forEach(function (x) {\n    x.value = \"00\";\n  });\n} //할인권 삭제\n\n\nfunction deleteList(idx, inSeqNo) {\n  if (confirm(\"할인내역을 삭제하시겠습니까?\")) {\n    fetch(\"/discount/list\", {\n      method: \"DELETE\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      body: JSON.stringify({\n        inSeqNo: inSeqNo,\n        idx: idx\n      })\n    }).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      if (data.result) {\n        DISCOUNT_CONTAINER.innerHTML = \"\";\n        discountList(data.list, inSeqNo);\n      }\n    }).catch(function (error) {\n      return console.log(error);\n    });\n  }\n} //할인내역 추가\n\n\nfunction insertList(inSeqNo, couponType) {\n  if (couponType !== \"00\") {\n    fetch(\"/discount/list\", {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      body: JSON.stringify({\n        inSeqNo: inSeqNo,\n        couponType: couponType\n      })\n    }).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      if (data.result) {\n        DISCOUNT_CONTAINER.innerHTML = \"\";\n        resetSelect();\n        discountList(data.list, inSeqNo);\n      }\n    }).catch(function (error) {\n      return console.log(error);\n    });\n  }\n} //이벤트 리스너\n\n\npreBtn.addEventListener(\"click\", backToSearch);\nsearchBtn.addEventListener(\"click\", searchInCar);\ninCarNo.addEventListener(\"input\", checkVal);\ninCarNo.addEventListener(\"keyup\", function (e) {\n  if (window.event.keyCode == 13) {\n    searchInCar();\n  }\n});\n\nwindow.onload = function () {\n  // console.log(process.env.IMAGE_SERVER_ADDRESS);\n  // console.log(process.env.IMAGE_SERVER_PORT);\n  inCarNo.focus();\n  CRUD_ARTICLE.style.display = \"none\";\n  var footer = document.querySelector(\"footer\");\n  footer.addEventListener(\"click\", searchInCarT);\n\n  if (window.location.pathname === \"/discount/history\") {\n    flatpickr(document.querySelector(\"#calender\"));\n  }\n};\n\n//# sourceURL=webpack://node_web/./src/client/js/discount.js?");

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