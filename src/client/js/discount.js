const LIST_DIV = document.querySelector("#listDiv");

const searchBtn = document.querySelector("#searchBtn");
const inCarNo = document.querySelector("#inCarNo");

function checkVal(obj) {
  obj.value = obj.value.replace(/[^0-9]/g, "");
}

function appendSearchList(result) {
  LIST_DIV.innerHTML = "";
  if (result.length !== 0) {
    for (var i = 0; i < result.length; i++) {
      const container = document.createElement("div");
      container.classList.add("search__container");
      container.dataset.inseqno = result[i].inSeqNo;

      const img = document.createElement("img");
      img.classList.add("search__img");
      img.src = `http://smcity.iptime.org/${result[i].inCarPicName}`;
      img.alt = "이미지를 불러오지 못했습니다.";
      img.width = "30px";
      img.height = "30px";

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
    // container.classList.add("no__data");
    const icon = document.createElement("div");
    icon.classList.add("no__data");
    const text = document.createElement("p");
    text.innerText = "조회된 차량이 없습니다.";
    container.appendChild(icon);
    container.appendChild(text);
    LIST_DIV.append(container);
  }
}

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

searchBtn.addEventListener("click", searchInCar);
inCarNo.addEventListener("keyup", function (e) {
  if (window.event.keyCode == 13) {
    searchInCar();
  }
});

window.onload = function () {
  console.log(process.env.SERVER_PORT);
  inCarNo.focus();
};
