var progressPercentage = 0;
var x = setInterval(function () {
  document
    .getElementsByClassName("progress-bar")[0]
    .setAttribute("style", "width:" + progressPercentage + "%");
  progressPercentage += 5;
  if (progressPercentage >= 80) {
    clearInterval(x);
  }
}, 100);

setTimeout(function () {
  document
    .getElementsByClassName("progress-bar")[0]
    .setAttribute("style", "width:" + 100 + "%");

  document.getElementById("jsData").innerHTML = "Test is ready. Good Luck!";
  document
    .getElementById("startBtn")
    .classList.remove("d-none", "btn-secondary");
  document.getElementById("startBtn").classList.add("btn-outline-warning");
}, 2000);
