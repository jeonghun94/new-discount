import moment from "moment";
const SEARCH_ARTICLE = document.querySelector("#searchArticle");
const CRUD_ARTICLE = document.querySelector("#crudArticle");
const LIST_DIV = document.querySelector("#listDiv");

const searchBtn = document.querySelector("#searchBtn");
const preBtn = document.querySelector("#preBtn");
const inCarNo = document.querySelector("#inCarNo");

const COUPON_CONTAINER = document.createElement("div");
COUPON_CONTAINER.classList.add("coupon__container");
COUPON_CONTAINER.id = "couponContainer";

const DISCOUNT_CONTAINER = document.createElement("div");
DISCOUNT_CONTAINER.classList.add("discount__container");

// 숫자만 입력받기
function checkVal() {
  this.value = this.value.replace(/[^0-9]/g, "");
}

// 조회 수 추가
function addRowsCount(data) {
  const views = document.createElement("p");
  views.innerText = "조회 ";
  views.classList.add("views__discount");

  const cnt = document.createElement("span");
  cnt.innerText = `${data}건`;
  views.appendChild(cnt);
  return views;
}

// 차량조회 돌아가기
function backToSearch() {
  SEARCH_ARTICLE.style.display = "block";
  CRUD_ARTICLE.style.display = "none";
  CRUD_ARTICLE.querySelector(".search__container").remove();
  CRUD_ARTICLE.querySelector(".coupon__container").remove();
  COUPON_CONTAINER.innerHTML = "";
  DISCOUNT_CONTAINER.innerHTML = "";
}

// 조회내역 없음
function notFound(container) {
  const notFoundContainer = document.createElement("div");
  notFoundContainer.classList.add("nodata__container");

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-exclamation");

  const p = document.createElement("p");
  p.innerText = "조회된 내역이 없습니다.";

  notFoundContainer.appendChild(icon);
  notFoundContainer.appendChild(p);

  container.append(notFoundContainer);
}

//차량조회 리스트 추가
function appendSearchList(list) {
  LIST_DIV.innerHTML = "";
  if (list.length !== 0) {
    list.map((x) => {
      const nowTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const insTime = moment().format(x.insDate);
      const duration = moment.duration(moment(nowTime).diff(moment(insTime)));
      const asMinutes = Math.floor(duration.asMinutes());
      console.log(asMinutes);

      const container = document.createElement("div");
      container.classList.add("search__container");
      container.dataset.inseqno = x.inSeqNo;

      const img = document.createElement("img");
      img.classList.add("search__img");
      img.src = `${process.env.IMAGE_SERVER_ADDRESS}:${process.env.IMAGE_SERVER_PORT}/${x.inCarPicName}`;
      img.alt = "이미지를 불러오지 못했습니다.";

      const info = document.createElement("div");
      info.classList.add("search__info");

      const inCarNo = document.createElement("p");
      inCarNo.innerText = `${x.inCarNo}(${asMinutes}분)`;

      const tkType = document.createElement("p");
      tkType.innerText = `입차종류: ${x.tkType}`;

      const unitName = document.createElement("p");
      unitName.innerText = `입차장비: ${x.unitName}`;

      const insDate = document.createElement("p");
      insDate.innerText = `입차시간: ${dateConvert(x.insDate)}`;

      info.appendChild(inCarNo);
      info.appendChild(tkType);
      info.appendChild(unitName);
      info.appendChild(insDate);

      container.appendChild(img);
      container.appendChild(info);

      LIST_DIV.append(container);
    });
  } else {
    notFound(LIST_DIV);
  }

  const searchInCarByInSeqNo = document.querySelectorAll(".search__container");
  searchInCarByInSeqNo.forEach((x) => {
    x.addEventListener("click", (e) => {
      const inSeqNo = e.currentTarget.dataset.inseqno;
      const cloneNode = e.currentTarget.cloneNode(true);
      SEARCH_ARTICLE.style.display = "none";
      CRUD_ARTICLE.style.display = "block";

      searchInSeqNo(inSeqNo, cloneNode);
    });
  });
}

// 관리자용 테스트차량조회
function searchInCarT() {
  fetch(`/search-in-car`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      const { result } = data;
      if (result.length > 0) {
        const testInCarNo = result[0].inCarNo;

        inCarNo.value = testInCarNo.substring(
          testInCarNo.length - 4,
          testInCarNo.length
        );

        searchBtn.click();
      }
    })
    .catch((error) => console.log(error));
}

// 차량조회(차량번호)
function searchInCar() {
  if (inCarNo.value.length === 4) {
    fetch(`/discount/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inCarNo: inCarNo.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { result } = data;
        appendSearchList(result);
      })
      .catch((error) => console.log(error));
  } else {
    alert("차량번호를 입력하세요.\nex_2258");
  }
}

//차량조회 + 쿠폰조회 + 할인내역조회
function searchInSeqNo(inSeqNo, cloneNode) {
  fetch(`/discount/search/inseqno`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inSeqNo,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const { freeCouponList, payCouponList, discountList: dList } = data;

      //조회 내역 복제 및 할인권, 할인내역 Container 추가
      CRUD_ARTICLE.append(cloneNode);
      CRUD_ARTICLE.querySelector(".search__container").style.border = "none";
      CRUD_ARTICLE.append(COUPON_CONTAINER);
      CRUD_ARTICLE.append(DISCOUNT_CONTAINER);
      //할인권 리스트 추가
      couponList(freeCouponList, "무료", "01");
      couponList(payCouponList, "유료", "02");

      //할인내역 리스트 추가
      discountList(dList, inSeqNo);
    })
    .catch((error) => console.log(error));
}

//할인내역 추가
function discountList(list, inSeqNo) {
  if (list.length !== 0) {
    DISCOUNT_CONTAINER.appendChild(addRowsCount(list.length));
    const discountHeader = document.createElement("div");
    discountHeader.classList.add("discount__header");
    discountHeader.innerHTML = "할인내역";
    DISCOUNT_CONTAINER.append(discountHeader);

    list.map((x) => {
      const discountInfoContainer = document.createElement("div");
      discountInfoContainer.classList.add("discount__info-container");
      discountInfoContainer.dataset.idx = x.idx;
      discountInfoContainer.dataset.dcname = x.dcName;
      discountInfoContainer.dataset.coupontype = x.couponType;

      const discountInfo = document.createElement("div");
      discountInfo.classList.add("discount__info");

      const discounInfoTitle = document.createElement("p");
      discounInfoTitle.classList.add("discount__info-title");
      discounInfoTitle.innerText = `${x.dcName} 할인권`;

      const discountInfoShopName = document.createElement("p");
      discountInfoShopName.innerText = `등록매장: ${x.shopName}`;

      const discountInfoInDate = document.createElement("p");
      discountInfoInDate.innerText = `등록일시: ${x.inTime.substring(
        0,
        10
      )} ${x.inTime.substring(11, 19)}`;

      discountInfo.appendChild(discounInfoTitle);
      discountInfo.appendChild(discountInfoShopName);
      discountInfo.appendChild(discountInfoInDate);

      const discountInfoDelete = document.createElement("div");
      discountInfoDelete.classList.add("discount__info-delete");
      discountInfoDelete.innerHTML = "삭제";

      discountInfoDelete.addEventListener("click", (e) => {
        const {
          idx,
          dcname: dcName,
          coupontype: couponType,
        } = e.currentTarget.parentNode.dataset;
        deleteList(idx, inSeqNo, dcName, couponType);
      });

      discountInfoContainer.appendChild(discountInfo);
      discountInfoContainer.appendChild(discountInfoDelete);

      DISCOUNT_CONTAINER.append(discountInfoContainer);
    });
  } else {
    notFound(DISCOUNT_CONTAINER);
  }
}

function discountHistoryList(list) {
  LIST_DIV.innerHTML = "";
  if (list.length !== 0) {
    LIST_DIV.appendChild(addRowsCount(list.length));
    list.map((x) => {
      const container = document.createElement("div");
      container.classList.add("search__container");

      const img = document.createElement("img");
      const imgSrc = x.totParkTime === null ? x.inCarPicName : x.outCarPicName;
      const imgBorderColor = x.totParkTime === null ? "#f8981c" : "#012d6b";

      img.classList.add("search__img");
      img.style.width = "48%";
      img.style.height = "100px";
      img.style.borderColor = imgBorderColor;
      img.src = `${process.env.IMAGE_SERVER_ADDRESS}:${process.env.IMAGE_SERVER_PORT}/${imgSrc}`;
      img.alt = "이미지를 불러오지 못했습니다.";

      const info = document.createElement("div");
      info.classList.add("search__info");
      info.style.fontSize = "14px";

      const inCarNo = document.createElement("p");
      inCarNo.innerText = `${x.inCarNo} ${
        x.totParkTime === null ? "" : `(${x.totParkTime}분)`
      }`;

      const dcName = document.createElement("p");
      dcName.innerText = `할인종류: ${x.dcName}`;

      const dcTime = document.createElement("p");
      dcTime.innerText = `할인일시: ${dateConvert(x.dcTime)}`;

      const inTime = document.createElement("p");
      inTime.innerText = `입차일시: ${dateConvert(x.inTime)}`;

      const outTime = document.createElement("p");
      outTime.innerText = `출차일시: ${
        x.outTime === null ? "출차전" : dateConvert(x.outTime)
      }`;

      info.appendChild(inCarNo);
      info.appendChild(dcName);
      info.appendChild(dcTime);
      info.appendChild(inTime);
      info.appendChild(outTime);

      container.appendChild(img);
      container.appendChild(info);

      LIST_DIV.append(container);
    });
  } else {
    notFound(LIST_DIV);
  }
}

//무료권 혹 유료권 2개가 아닐시 명칭 변경
function couponInvalid() {
  const coupon = document.querySelectorAll(".coupon__container-type");
  if (coupon.length === 1) {
    coupon[0].querySelector("h6").innerText = "할인권";
  } else if (coupon.length === 2) {
    coupon[0].querySelector("h6").innerText = "무료권";
    coupon[1].querySelector("h6").innerText = "유료권";
  }
}

//할인권 SELECT 추가
function couponList(list, text, payType) {
  if (list.length !== 0) {
    const type = document.createElement("div");
    type.classList.add("coupon__container-type");

    const typeText = document.createElement("h6");
    typeText.innerText = `${text}권`;

    const select = document.createElement("select");
    select.classList.add("coupon__list");

    const option = document.createElement("option");
    option.innerText = "할인권 선택";
    option.value = "00";

    select.append(option);

    //할인권 선택 시 할인 내역 추가
    select.addEventListener("change", (e) => {
      const inSeqNo =
        CRUD_ARTICLE.querySelector(".search__container").dataset.inseqno;
      const {
        options: {
          [e.currentTarget.selectedIndex]: { text },
        },
        value: couponType,
      } = e.currentTarget;

      if (
        couponType !== "00" &&
        confirm(
          `${
            text.indexOf("잔여") === -1 ? text : text.split("(")[0]
          } 할인을 등록하시겠습니까?`
        )
      ) {
        insertList(inSeqNo, couponType, type);
      } else {
        resetSelect();
      }
    });

    list.map((x) => {
      const option = document.createElement("option");
      if (process.env.PAY_AFTER === "N") {
        if (payType === "02") {
          option.innerText = `${x.dcName}${
            text === "유료" ? `(잔여:${x.stock}매)` : ""
          }`;
        } else {
          option.innerText = `${x.dcName}`;
        }
      } else {
        option.innerText = `${x.dcName}`;
      }

      option.value = `${x.couponType}`;
      select.append(option);
    });

    type.append(typeText);
    type.append(select);

    COUPON_CONTAINER.append(type);
  }
  couponInvalid();
}

// 웹 할인 등록 취소 시 opiton 초기화
function resetSelect() {
  const select = document.querySelectorAll("select");
  select.forEach((x) => {
    x.value = "00";
  });
}

// 웹 할인 등록
async function insertList(inSeqNo, couponType, select) {
  if (couponType !== "00") {
    await fetch(`/discount/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inSeqNo,
        couponType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === "fail") {
          alert(data.msg);
        } else {
          DISCOUNT_CONTAINER.innerHTML = "";

          // 할인 내역 그리기
          discountList(data.list, inSeqNo);

          // 유료 할인권 잔여 수량 업데이트
          select.remove();
          couponList(data.payCouponList, "유료", data.payType);
          alert("할인 등록 완료");
        }
        // 선택 초기화
        resetSelect();
      })
      .catch((error) => console.log(error));
  }
}

// 웹 할인 내역 삭제
function deleteList(idx, inSeqNo, dcName, couponType) {
  if (confirm(`${dcName} 할인을 삭제하시겠습니까?`)) {
    fetch(`/discount/list`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idx,
        inSeqNo,
        couponType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === "success") {
          DISCOUNT_CONTAINER.innerHTML = "";
          discountList(data.list, inSeqNo);
          deleteListUpdatStock(data.payCouponList, data.payType);
          alert("할인 삭제 완료");
        } else {
          alert(`할인 삭제 실패\n사유: ${data.msg}`);
        }
      })
      .catch((error) => console.log(error));
  }
}

// 웹 할인 내역 삭제, 잔여 수량 업데이트
function deleteListUpdatStock(list, payType) {
  const couponContainer = document.querySelectorAll(".coupon__container-type");
  couponContainer.length === 1
    ? couponContainer[0].remove()
    : couponContainer[1].remove();
  couponList(list, "유료", payType);
}

// 웹 할인 등록내역
function history() {
  const startDate = document.querySelector("#startDate").value;
  const endDate = document.querySelector("#endDate").value;
  const inCarNo = document.querySelector("#inCarNo").value;

  fetch(`/discount/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate,
      endDate,
      inCarNo,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        discountHistoryList(data.result);
      }
    })
    .catch((error) => console.log(error));
}

// 웹 할인 등록내역 엑셀 다운로드
function historyExcel() {
  const search__container = document.querySelectorAll(".search__container");
  const startDate = document.querySelector("#startDate").value;
  const endDate = document.querySelector("#endDate").value;
  const inCarNo = document.querySelector("#inCarNo").value;

  if (search__container.length === 0) {
    alert("내려받을 내용이 없습니다.");
  } else {
    location.href = `${window.location.pathname}/excel?startDate=${startDate}&endDate=${endDate}&inCarNo=${inCarNo}`;
  }
}

// 조회 후 날짜 가공
function dateConvert(date) {
  return `${date.substring(5, 10)} ${date.substring(11, 16)}`;
}

window.onload = function () {
  inCarNo.focus();
  const footer = document.querySelector("footer");
  footer.addEventListener("click", searchInCarT);
  inCarNo.addEventListener("input", checkVal);

  // 경로에 따라 다른 페이지로 이동
  if (window.location.pathname === "/discount/history") {
    const historyExcelBtn = document.querySelector("#historyExcelBtn");
    historyExcelBtn.addEventListener("click", historyExcel);

    const historyBtn = document.querySelector("#historyBtn");
    historyBtn.addEventListener("click", history);

    preBtn.addEventListener("click", function () {
      window.history.back();
    });

    inCarNo.addEventListener("keyup", function (e) {
      if (window.event.keyCode == 13) {
        history();
      }
    });
  } else if (window.location.pathname === "/discount/main") {
    CRUD_ARTICLE.style.display = "none";
    //이벤트 리스너
    preBtn.addEventListener("click", backToSearch);
    searchBtn.addEventListener("click", searchInCar);

    inCarNo.addEventListener("keyup", function (e) {
      if (window.event.keyCode == 13) {
        searchInCar();
      }
    });
  }
};
