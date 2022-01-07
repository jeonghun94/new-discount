function checkVal(obj) {
  obj.value = obj.value.replace(/[^0-9]/g, "");
}

window.onload = function () {
  console.log(process.env.SERVER_PORT);
};
