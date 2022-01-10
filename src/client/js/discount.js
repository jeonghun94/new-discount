const SEARCH_ARTICLE = document.querySelector("#searchArticle");
const CRUD_ARTICLE = document.querySelector("#crudArticle");
const LIST_DIV = document.querySelector("#listDiv");

const searchBtn = document.querySelector("#searchBtn");
const preBtn = document.querySelector("#preBtn");
const inCarNo = document.querySelector("#inCarNo");

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
    const container = document.createElement("div");
    container.classList.add("test");

    const icon = document.createElement("div");
    icon.classList.add("no__data");

    const text = document.createElement("p");
    text.innerText = "조회된 차량이 없습니다.";
    container.appendChild(icon);
    container.appendChild(text);

    SEARCH_ARTICLE.append(container);
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

//차량조회(입차번호)
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
      const { result } = data;
      CRUD_ARTICLE.append(cloneNode);
      CRUD_ARTICLE.querySelector(".search__container").style.border = "none";

      const couponContainer = document.createElement("div");
      couponContainer.classList.add("coupon__container");

      const typeFree = document.createElement("div");
      typeFree.classList.add("coupon__container-type");

      const typePay = document.createElement("div");
      typePay.classList.add("coupon__container-type");

      const freeCoupon = document.createElement("h6");
      freeCoupon.innerText = "무료권";

      const payCoupon = document.createElement("h6");
      payCoupon.innerText = "유료권";

      const freeCouponList = document.createElement("select");
      freeCouponList.classList.add("coupon__list");

      const payCouponList = document.createElement("select");
      payCouponList.classList.add("coupon__list");

      const freeCouponOption = document.createElement("option");
      freeCouponOption.innerText = "할인권 선택";

      const payCouponOption = document.createElement("option");
      payCouponOption.innerText = "할인권 선택";

      freeCouponList.append(freeCouponOption);
      payCouponList.append(payCouponOption);

      typeFree.append(freeCoupon);
      typeFree.append(freeCouponList);
      typePay.append(payCoupon);
      typePay.append(payCouponList);

      couponContainer.append(typeFree);
      couponContainer.append(typePay);

      CRUD_ARTICLE.append(couponContainer);
    })
    .catch((error) => console.log(error));
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
  console.log(process.env.IMAGE_SERVER_ADDRESS);
  console.log(process.env.IMAGE_SERVER_PORT);
  inCarNo.focus();
  CRUD_ARTICLE.style.display = "none";

  const footer = document.querySelector("footer");
  footer.addEventListener("click", searchInCarT);
};
