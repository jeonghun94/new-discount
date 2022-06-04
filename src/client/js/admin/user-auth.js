import { async } from "regenerator-runtime";
import { radioInit } from "../common";

// const table = document.querySelector("#historyTable tbody");
// const rows = table.querySelectorAll("tr");
// const tableRows = [];

let USERS = [];
let USER_CODE = "";

const formShopDuplication = document.querySelector("#formShopDuplication");
const formTimeLimitMinutes = document.querySelector("#formTimeLimitMinutes");
const formTimeLimit = document.querySelector("#formTimeLimit");
const formMaxCnt = document.querySelector("#formMaxCnt");
const formFreeCnt = document.querySelector("#formFreeCnt");
const formPayCnt = document.querySelector("#formPayCnt");

const selectAllBox = document.querySelector("#selectAllBox");
const checkboxes = document.getElementsByName("user");

const searchBtn = document.getElementById("searchBtn");
const updBtn = document.querySelector("#updBtn");

const TABLE_ROWS = document.querySelector("table tbody");
let VIEWS_COUNT = document.querySelector("#viewsCount");

const rerenderRows = (users) => {
  VIEWS_COUNT.innerText = ` ${users.length}`;
  while (TABLE_ROWS.hasChildNodes()) {
    TABLE_ROWS.removeChild(TABLE_ROWS.firstChild);
  }

  if (users.length > 0) {
    users.map((user) => {
      const newRow = TABLE_ROWS.insertRow();
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "user";
      input.value = user.shopCode;
      input.checked = false;
      input.addEventListener("change", checkOne);

      newRow.insertCell(0).appendChild(input);
      newRow.insertCell(1).innerText = user.shopName;
      newRow.insertCell(2).innerText = user.shopDuplication;
      newRow.insertCell(3).innerText = user.timeLimit;
      newRow.insertCell(4).innerText = user.timeLimitMinutes;
      newRow.insertCell(5).innerText = user.maxCnt;
      newRow.insertCell(6).innerText = user.freeCnt;
      newRow.insertCell(7).innerText = user.payCnt;
      newRow.insertCell(8).innerText = user.updDate;
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
};

const handleSearch = () => {
  USERS = [];
  let url = `/admin/discount/user-auth?search=Y`;
  const checkRadio = document.querySelector("input[type=radio]:checked").id;

  if (checkRadio === "shop") {
    url += `&shopCode=${USER_CODE}`;
  }

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      rerenderRows(res);
    });
};
searchBtn.addEventListener("click", handleSearch);

const searchUserForm = document.getElementById("searchUserForm");
const findUserCode = (e) => {
  const dataList = document.querySelector(
    "#selectUsers option[value='" + e.target.value + "']"
  );

  USER_CODE = dataList?.dataset ? dataList.dataset.code : "0000";
  console.log(USER_CODE);
};
searchUserForm.addEventListener("input", (e) => findUserCode(e));

const radioChange = (val) => {
  const shop = document.querySelector("#searchUserForm");
  switch (val) {
    case "all":
      shop.disabled = true;
      break;
    case "shop":
      shop.disabled = false;
      break;
    default:
      break;
  }
};

const selectAll = () => {
  USERS = [];
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAllBox.checked;
    selectAllBox.checked ? USERS.push(checkbox.value) : (USERS = []);
    checkbox.addEventListener("change", checkOne);
  });
};

const checkOne = (e) => {
  if (e.target.checked) {
    USERS.push(e.target.value);
  } else {
    for (let i = 0; i < USERS.length; i++) {
      if (USERS[i] === e.target.value) {
        USERS.splice(i, 1);
        i--;
      }
    }
  }
};

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", checkOne);
});

updBtn.addEventListener("click", (e) => {
  if (USERS.length <= 0) {
    alert("선택된 매장이 없습니다.\n매장을 선택해주세요.");
    return;
  } else {
    if (formTimeLimitMinutes.value === "") {
      alert("시간 제한 분을 입력 하세요.");
      return;
    }

    if (formMaxCnt.value === "") {
      alert("총 할인 수를 입력 하세요.");
      return;
    }

    if (formFreeCnt.value === "") {
      alert("무료 할인 수를 입력 하세요.");
      return;
    }

    if (formPayCnt.value === "") {
      alert("유료 할인 수를 입력 하세요.");
      return;
    }
  }

  fetch("/admin/discount/user-auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shopCode: USERS,
      shopDuplication: formShopDuplication.value,
      timeLimit: formTimeLimit.value,
      timeLimitMinutes: formTimeLimitMinutes.value,
      maxCnt: formMaxCnt.value,
      freeCnt: formFreeCnt.value,
      payCnt: formPayCnt.value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      rerenderRows(res);
      alert("수정되었습니다.");
      console.log(res);
    });
});

selectAllBox.addEventListener("change", selectAll);

radioInit(radioChange);
