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
