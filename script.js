const background = document.querySelector(".background");
const main = document.querySelector(".main");
const buttonHistory = document.querySelector(".buttonHistory");
const buttonClear = document.querySelector(".buttonClear");
const history = document.querySelector(".history");
const popap = document.querySelector(".popap");

let state = "none";
let timeout;
let timeAfterDelay;
let yourReationData;

onload();
function onload() {
  if (localStorage.getItem("yourReationData")) {
    yourReationData = JSON.parse(localStorage.getItem("yourReationData"));
    addData();
  } else yourReationData = [];
}

function addData() {
  for (let elem of yourReationData) {
    let div = document.createElement("div");
    if (elem == "fail") {
      div.textContent = elem;
    } else {
      div.textContent = elem + " ms";
    }
    history.prepend(div);
  }
}

buttonHistory.addEventListener("mousedown", function (event) {
  event.stopPropagation();
  if (getComputedStyle(popap).display == "none") {
    popap.style.display = "block";
    history.style.display = "block";
    buttonClear.style.display = "block";
    clearTimeout(timeout);
    state = "none";
    background.style.background = "gray";
    main.innerHTML = "Кликни, когда будешь готов, чтобы проверить реакцию";
  } else if (getComputedStyle(popap).display == "block") {
    popap.style.display = "none";
    history.style.display = "none";
    buttonClear.style.display = "none";
  }
});
popap.addEventListener("mousedown", function (event) {
  event.stopPropagation();
});

buttonClear.addEventListener("mousedown", function (event) {
  event.stopPropagation();
  localStorage.clear();
  onload();
  history.innerHTML = "";
});

background.addEventListener("mousedown", function (event) {
  if (getComputedStyle(popap).display == "none") event.preventDefault(); //copy
  if (getComputedStyle(popap).display == "block") {
    return;
  }
  let div;
  switch (state) {
    case "none":
    case "red":
      doTest();
      break;
    case "delay":
      clearTimeout(timeout);
      background.style.background = "red";
      main.innerHTML = "Слишком рано!";
      state = "red";
      div = document.createElement("div");
      div.textContent = "fail";
      history.prepend(div);
      yourReationData.push("fail");
      localStorage.setItem("yourReationData", JSON.stringify(yourReationData));
      break;
    case "wait":
      let res = (performance.now() - timeAfterDelay).toFixed(1);
      background.style.background = "gray";
      main.innerHTML = `Результат ${res} ms<br />
        Кликни, когда будешь готов, чтобы проверить реакцию`;
      state = "none";
      div = document.createElement("div");
      div.textContent = res + " ms";
      history.prepend(div);
      yourReationData.push(res);
      localStorage.setItem("yourReationData", JSON.stringify(yourReationData));
      break;
  }
});

function doTest() {
  background.style.background = "blue";
  main.innerHTML = "Дождись зелёный цвет и кликни";
  state = "delay";
  let delay = (Math.random() * 10 + 1) * 1000;
  timeAfterDelay = performance.now();

  timeout = setTimeout(() => {
    background.style.background = "lime";
    main.innerHTML = "Жми!!!";
    state = "wait";
    let lag = performance.now() - timeAfterDelay - delay;
    timeAfterDelay += delay + lag;
  }, delay);
}
