const SUB_MENU = document.querySelector("nav");

window.onload = function () {
  if (window.location.pathname === "/password") {
    const updBtn = document.querySelector("#updBtn");
    document.querySelector("#oldPassword").focus();
    updBtn.addEventListener("click", userPasswordUpdate);
  }

  menuActive();
};

// 관리자 페이지 메뉴 활성화
function menuActive() {
  const pathName = document.location.pathname.split(".")[0];
  for (let i = 0; i < SUB_MENU.children.length; i++) {
    const menu = SUB_MENU.children[i];
    if (pathName === menu.dataset.path) {
      menu.classList.add("nav-active");
    }
  }
}

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
