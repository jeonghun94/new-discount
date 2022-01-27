const coupon = document.querySelector("#searchCouponList");
const shop = document.querySelector("#searchShopList");
const SUB_MENU = document.querySelector("nav");
const INS_BTN = document.querySelector("#insBtn");
const SEARCH_BTN = document.querySelector("#searchBtn");
const TABLE_ROWS = document.querySelector("table tbody");

window.onload = function () {
  if (window.location.pathname === "/admin/sale-coupon") {
    menuActive();
    coupon.disabled = true;
    shop.disabled = true;
    const radio = document.querySelectorAll("input[type=radio]");
    const radioLength = radio.length;

    for (let i = 0; i < radioLength; i++) {
      radio[i].addEventListener("change", function () {
        radioChange(this.id);
      });
    }
  }

  const cnt = document.querySelector("#couponCnt");
  cnt.addEventListener("keyup", function () {
    format(this);
  });
};

SEARCH_BTN.addEventListener("click", saleCouponHistory);

INS_BTN.addEventListener("click", function () {
  const shop = document.querySelector("#shopCode");
  const type = document.querySelector("#couponType");
  const cnt = document.querySelector("#couponCnt");

  if (cnt.value === "" || cnt.value === null) {
    alert("수량을 입력해 주세요.");
    return;
  }

  const shopValue = shop.options[shop.selectedIndex].value;
  const typeValue = type.options[type.selectedIndex].value;

  const shopText = shop.options[shop.selectedIndex].text;
  const typeText = type.options[type.selectedIndex].text;

  if (
    confirm(
      `${typeText} 할인권 ${cnt.value}개를\n${shopText}에 등록하시겠습니까?`
    )
  ) {
    addSaleCouponList({
      shopCode: shopValue,
      couponType: typeValue,
      couponCnt: cnt.value,
    });
  } else {
    alert("취소되었습니다.");
  }
});

function saleCouponHistory() {
  const startDate = document
    .querySelector("#startDate")
    .value.replace(/-/gi, "");
  const endDate = document.querySelector("#endDate").value.replace(/-/gi, "");
  const type = document.querySelector('input[name="searchType"]:checked').id;

  fetch(
    `/admin/sale-coupon?startDate=${startDate}&endDate=${endDate}&type=${type}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const { saleCouponList: result } = data;
      rerenderRows(result);
    })
    .catch((error) => console.log(error));
}

function addSaleCouponList(obj) {
  console.log(JSON.stringify(obj));
  fetch(`/admin/sale-coupon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((response) => response.json())
    .then((data) => {
      const { saleCouponList: result } = data;
      rerenderRows(result);
    })
    .catch((error) => console.log(error));
}

function rerenderRows(data) {
  while (TABLE_ROWS.hasChildNodes()) {
    TABLE_ROWS.removeChild(TABLE_ROWS.firstChild);
  }

  if (data.length > 0) {
    data.map((x) => {
      const newRow = TABLE_ROWS.insertRow();
      newRow.insertCell(0).innerText = x.shopName;
      newRow.insertCell(1).innerText = x.dcName;
      newRow.insertCell(2).innerText = x.saleCouponQty;
      newRow.insertCell(3).innerText = x.saleCouponAmt;
      newRow.insertCell(4).innerText = x.insDate;
    });
  } else {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.setAttribute("colspan", "100%");
    td.innerText = "조회된 데이터가 없습니다.";
    td.classList.add("not__found");
    tr.appendChild(td);
    TABLE_ROWS.appendChild(tr);
  }
}

function format(obj) {
  obj.value = comma(uncomma(obj.value));
}

function comma(str) {
  str = String(str);
  const minus = str.substring(0, 1);

  str = str.replace(/[^\d]+/g, "");
  str = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");

  if (minus == "-") str = "-" + str;

  return str;
}

function commaToString(price) {
  return price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function uncomma(str) {
  str = String(str);
  const minus = str.substring(0, 1);
  str = str.replace(/[^\d]+/g, "");

  if (minus == "-") str = "-" + str;
  return str;
}

function menuActive() {
  const pathName = document.location.pathname.split(".")[0];
  for (let i = 0; i < SUB_MENU.children.length; i++) {
    const menu = SUB_MENU.children[i];
    if (pathName === menu.dataset.path) {
      menu.classList.add("nav-active");
    }
  }
}

function radioChange(val) {
  switch (val) {
    case "all":
      coupon.disabled = true;
      shop.disabled = true;
      break;

    case "shop":
      coupon.disabled = false;
      shop.disabled = false;
      coupon.style.display = "none";
      shop.style.display = "block";
      break;

    case "coupon":
      coupon.disabled = false;
      shop.disabled = false;
      coupon.style.display = "block";
      shop.style.display = "none";
      break;

    default:
      break;
  }
}
