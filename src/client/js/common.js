const SUB_MENU = document.querySelector("nav");

window.onload = function () {
  if (window.location.pathname === "/password") {
    const updBtn = document.querySelector("#updBtn");
    document.querySelector("#oldPassword").focus();
    updBtn.addEventListener("click", userPasswordUpdate);
  }

  const table = document.querySelector("#historyTable tbody");
  const rows = table.querySelectorAll("tr");
  const tableRows = [];

  const formShopDuplication = document.querySelector("#formShopDuplication");
  const formTimeLimit = document.querySelector("#formTimeLimit");
  const formTimeLimitMinutes = document.querySelector("#formTimeLimitMinutes");
  const formMaxCnt = document.querySelector("#formMaxCnt");
  const formFreeCnt = document.querySelector("#formFreeCnt");
  const formPayCnt = document.querySelector("#formPayCnt");

  for (let i = 0; i < rows.length; i++) {
    tableRows.push(rows[i]);

    rows[i].addEventListener("click", (e) => {
      const row = rows[i];
      row.style.backgroundColor = "#f8981c";
      row.style.color = "white";

      // const shopCode = rows[i].querySelector("td:nth-child(1) > input").value;
      // const shopName = row.querySelector("td:nth-child(2)").innerText;
      const shopDuplication = row.querySelector("td:nth-child(3)").innerText;
      const timeLimit = row.querySelector("td:nth-child(4)").innerText;
      const timeLimitMinutes = row.querySelector("td:nth-child(5)").innerText;
      const maxCnt = row.querySelector("td:nth-child(6)").innerText;
      const freeCnt = row.querySelector("td:nth-child(7)").innerText;
      const payCnt = row.querySelector("td:nth-child(8)").innerText;

      formShopDuplication.value =
        shopDuplication === "" ? "N" : shopDuplication;
      formTimeLimit.value = timeLimit === "" ? "N" : timeLimit;
      formTimeLimitMinutes.value =
        timeLimitMinutes === "" ? "0" : timeLimitMinutes;
      formMaxCnt.value = maxCnt === "" ? "2" : maxCnt;
      formFreeCnt.value = freeCnt === "" ? "1" : freeCnt;
      formPayCnt.value = payCnt === "" ? "1" : payCnt;
    });
  }
};
const checkbox1 = document.querySelector("#selectAll");
document.getElementById("selectAll").onchange = selectAll;

function selectAll() {
  const checkboxes = document.getElementsByName("user");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = checkbox1.checked;
  });
}

// 관리자 페이지 메뉴 활성화
export const menuActive = () => {
  const pathName = document.location.pathname.split(".")[0];
  for (let i = 0; i < SUB_MENU.children.length; i++) {
    const menu = SUB_MENU.children[i];
    if (pathName === menu.dataset.path) {
      menu.classList.add("nav-active");
    }
  }
};

export const radioInit = (radioChange) => {
  const radio = document.querySelectorAll("input[type=radio]");
  const radioLength = radio.length;
  for (let i = 0; i < radioLength; i++) {
    radio[i].addEventListener("change", function () {
      radioChange(this.id);
    });
  }
};

// 파일 업로드시 확장자 체크
export const getFileExtension = (fileName) => {
  const fileLength = fileName.length;
  const lastDot = fileName.lastIndexOf(".");
  const fileExtension = fileName
    .substring(lastDot + 1, fileLength)
    .toLowerCase();

  return fileExtension;
};

export const format = (obj) => {
  obj.value = comma(uncomma(obj.value));
};

function comma(str) {
  str = String(str);
  const minus = str.substring(0, 1);

  str = str.replace(/[^\d]+/g, "");
  str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (minus == "-") str = "-" + str;

  return str;
}

function uncomma(str) {
  str = String(str);
  const minus = str.substring(0, 1);
  str = str.replace(/[^\d]+/g, "");

  if (minus == "-") str = "-" + str;
  return str;
}

// function commaToString(price) {
//   return price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
// }

// 조회 결과 없음 표시
function nodata(container) {
  const noDataContainer = document.createElement("div");
  noDataContainer.classList.add("nodata__container");

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-exclamation");

  const p = document.createElement("p");
  p.innerText = "조회된 내역이 없습니다.";

  noDataContainer.appendChild(icon);
  noDataContainer.appendChild(p);

  container.append(noDataContainer);
}

function userPasswordUpdate() {
  const newPasswordCheck = document.getElementById("newPasswordCheck").value;
  const newPassword = document.getElementById("newPassword").value;
  const oldPassword = document.getElementById("oldPassword").value;

  if (
    oldPassword == null ||
    newPassword == null ||
    newPasswordCheck == null ||
    oldPassword == "" ||
    newPassword == "" ||
    newPasswordCheck == ""
  ) {
    alert("모든 항목을 채워주세요.");
    return false;
  } else {
    if (newPassword !== newPasswordCheck) {
      alert("새로운 비밀번호가 일치하지 않습니다.");
      return false;
    } else {
      fetch("/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.result === "success") {
            alert("비밀번호가 변경되었습니다.\n다시 로그인해주세요.");
            window.location.href = "/logout";
          } else {
            alert(`비밀번호 변경에 실패하였습니다.\n사유: ${data.msg}`);
            return false;
          }
        });
    }
  }
}
