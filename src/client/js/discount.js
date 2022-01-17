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

//숫자만 입력받기
function checkVal() {
  this.value = this.value.replace(/[^0-9]/g, "");
}

//차량조회 돌아가기
function backToSearch() {
  SEARCH_ARTICLE.style.display = "block";
  CRUD_ARTICLE.style.display = "none";
  CRUD_ARTICLE.querySelector(".search__container").remove();
  CRUD_ARTICLE.querySelector(".coupon__container").remove();
  COUPON_CONTAINER.innerHTML = "";
  DISCOUNT_CONTAINER.innerHTML = "";
}

//조히내역 없음
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
function appendSearchList(result) {
  LIST_DIV.innerHTML = "";
  if (result.length !== 0) {
    for (var i = 0; i < result.length; i++) {
      const container = document.createElement("div");
      container.classList.add("search__container");
      container.dataset.inseqno = result[i].inSeqNo;

      const img = document.createElement("img");
      img.classList.add("search__img");
      img.src = `${process.env.IMAGE_SERVER_ADDRESS}:${process.env.IMAGE_SERVER_PORT}/${result[i].inCarPicName}`;
      img.alt = "이미지를 불러오지 못했습니다.";

      const info = document.createElement("div");
      info.classList.add("search__info");

      const inCarNo = document.createElement("p");
      inCarNo.innerText = result[i].inCarNo;

      const tkType = document.createElement("p");
      tkType.innerText = `입차종류: ${result[i].tkType}`;

      const unitName = document.createElement("p");
      unitName.innerText = `입차장비: ${result[i].unitName}`;

      const insDate = document.createElement("p");
      insDate.innerText = `입차시간: ${result[i].insDate.substring(
        5,
        result[i].insDate.length - 3
      )}`;

      info.appendChild(inCarNo);
      info.appendChild(tkType);
      info.appendChild(unitName);
      info.appendChild(insDate);

      container.appendChild(img);
      container.appendChild(info);

      LIST_DIV.append(container);
    }
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

//차량조회 테스트
function searchInCarT() {
  fetch(`/search-in-car`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      const { result } = data;

      const testInCarNo = result[0].inCarNo;

      inCarNo.value = testInCarNo.substring(
        testInCarNo.length - 4,
        testInCarNo.length
      );

      result.map((x, idx) => {
        console.log(`${idx + 1}.${x.inCarNo}`);
      });

      searchBtn.click();
    })
    .catch((error) => console.log(error));
}

//차량조회(차량번호)
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
    alert("차량번호는 4자리이어야 합니다.");
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
      couponList(freeCouponList, "무료");
      couponList(payCouponList, "유료");
      couponInvalid();

      //할인내역 리스트 추가
      discountList(dList, inSeqNo);
    })
    .catch((error) => console.log(error));
}

//할인내역 추가
function discountList(list, inSeqNo) {
  if (list.length !== 0) {
    const discountHeader = document.createElement("div");
    discountHeader.classList.add("discount__header");
    discountHeader.innerHTML = "할인내역";
    DISCOUNT_CONTAINER.append(discountHeader);

    list.map((x) => {
      const discountInfoContainer = document.createElement("div");
      discountInfoContainer.classList.add("discount__info-container");
      discountInfoContainer.dataset.idx = x.idx;

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
        const idx = e.currentTarget.parentNode.dataset.idx;
        deleteList(idx, inSeqNo);
      });

      discountInfoContainer.appendChild(discountInfo);
      discountInfoContainer.appendChild(discountInfoDelete);

      DISCOUNT_CONTAINER.append(discountInfoContainer);
    });
  } else {
    notFound(DISCOUNT_CONTAINER);
  }
}

//무료권 혹 유료권 2개가 아닐시 명칭 변경
function couponInvalid() {
  const coupon = document.querySelectorAll(".coupon__container-type");

  if (coupon.length === 1) {
    coupon[0].querySelector("h6").innerText = "할인권";
  }
}

//할인권 SELECT 추가
function couponList(list, text) {
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
      const { text: dcName, value: couponType } = e.currentTarget;

      if (couponType !== "00" && confirm(`할인권을 등록하시겠습니까?`)) {
        insertList(inSeqNo, couponType);
      } else {
        resetSelect();
      }
    });

    list.map((x) => {
      const option = document.createElement("option");
      option.innerText = `${x.dcName}`;
      option.value = `${x.couponType}`;
      select.append(option);
    });

    type.append(typeText);
    type.append(select);

    COUPON_CONTAINER.append(type);
  }
}

function resetSelect() {
  const select = document.querySelectorAll("select");
  select.forEach((x) => {
    x.value = "00";
  });
}

//할인권 삭제
function deleteList(idx, inSeqNo) {
  if (confirm("할인내역을 삭제하시겠습니까?")) {
    fetch(`/discount/list`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inSeqNo,
        idx,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          DISCOUNT_CONTAINER.innerHTML = "";
          discountList(data.list, inSeqNo);
        }
      })
      .catch((error) => console.log(error));
  }
}

//할인내역 추가
function insertList(inSeqNo, couponType) {
  if (couponType !== "00") {
    fetch(`/discount/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inSeqNo,
        couponType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          DISCOUNT_CONTAINER.innerHTML = "";
          resetSelect();
          discountList(data.list, inSeqNo);
        }
      })
      .catch((error) => console.log(error));
  }
}

//이벤트 리스너
preBtn.addEventListener("click", backToSearch);
searchBtn.addEventListener("click", searchInCar);

inCarNo.addEventListener("input", checkVal);
inCarNo.addEventListener("keyup", function (e) {
  if (window.event.keyCode == 13) {
    searchInCar();
  }
});

window.onload = function () {
  // console.log(process.env.IMAGE_SERVER_ADDRESS);
  // console.log(process.env.IMAGE_SERVER_PORT);
  inCarNo.focus();
  CRUD_ARTICLE.style.display = "none";

  const footer = document.querySelector("footer");
  footer.addEventListener("click", searchInCarT);

  if (window.location.pathname === "/discount/history") {
    flatpickr(document.querySelector("#calender"));
  }
};
