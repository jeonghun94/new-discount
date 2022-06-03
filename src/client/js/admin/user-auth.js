import { radioInit } from "../common";

// const table = document.querySelector("#historyTable tbody");
// const rows = table.querySelectorAll("tr");
// const tableRows = [];

let USERS = [];

const formShopDuplication = document.querySelector("#formShopDuplication");
const formTimeLimitMinutes = document.querySelector("#formTimeLimitMinutes");
const formTimeLimit = document.querySelector("#formTimeLimit");
const formMaxCnt = document.querySelector("#formMaxCnt");
const formFreeCnt = document.querySelector("#formFreeCnt");
const formPayCnt = document.querySelector("#formPayCnt");

const selectAllBox = document.querySelector("#selectAllBox");
const checkboxes = document.getElementsByName("user");

const updBtn = document.querySelector("#updBtn");

function radioChange(val) {
  const shop = document.querySelector("#searchShopList");
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
}

function selectAll() {
  USERS = [];
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAllBox.checked;
    selectAllBox.checked ? USERS.push(checkbox.value) : (USERS = []);
    checkbox.addEventListener("change", checkOne);
  });
}

function checkOne() {
  if (this.checked) {
    USERS.push(this.value);
  } else {
    for (let i = 0; i < USERS.length; i++) {
      if (USERS[i] === this.value) {
        USERS.splice(i, 1);
        i--;
      }
    }
  }
}

updBtn.addEventListener("click", (e) => {
  if (USERS.length <= 0) {
    alert("선택된 매장이 없습니다.\n매장을 선택해주세요.");
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
      console.log(res);
    });
});

selectAllBox.addEventListener("change", selectAll);

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", checkOne);
});

radioInit(radioChange);
