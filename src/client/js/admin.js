const coupon = document.querySelector("#searchCouponList");
const shop = document.querySelector("#searchShopList");
const SUB_MENU = document.querySelector("nav");

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
};

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
