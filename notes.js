var i = 1;
var rayBox = [];

function star() {
  for (var i = 0; i < 20; i++) {
    console.log(i);
  }
}

star();

// $grid-breakpoints: (
//   xs: 0,
//   sm: 576px,
//   md: 768px,
//   lg: 992px,
//   xl: 1200px,
//   xxl: 1400px
// );

var currentSection = localStorage.getItem("currentSection");
console.log(currentSection);

if (currentSection === "reading") {
  localStorage.setItem("currentSection", "writing");
} else if (currentSection === "writing") {
  localStorage.setItem("currentSection", "completed");
} else {
  localStorage.setItem("currentSection", "reading");
}

function doneBackup() {
  console.log(doneList);
  var ls = localStorage.getItem("doneList");
  var timeLeft = localStorage.getItem("timeLeft");

  var url = "/endsection";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      ls: ls,
      timeLeft: timeLeft,
      section: "reading",
      user_id: user_id,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("response: ", data);
      if (data === "progress saved") {
        console.log("data saved");
      }
    });
}

var elapsed = 0;
var x = setInterval(function () {
  doneBackup();
  elapsed += 30000;
  console.log(elapsed);

  if (elapsed > 3600000) {
    clearInterval();
  }
}, 30000);

function nextFunction() {
  var checkRadio = document.querySelector('input[name="fav_language"]:checked');
  if (checkRadio != null) {
    var clickedBtn = document.getElementById("b" + currentQuestion.toString());

    console.log(flagList);

    if (flagList.hasOwnProperty(currentQuestion.toString())) {
      console.log("in flag function");
      currentQuestion += 1;
      btnFunction(currentQuestion);
    } else {
      clickedBtn.classList.remove("btn-light", "btn-warning", "btn-dark");
      clickedBtn.classList.add("btn-primary");
      doneList[currentQuestion] = checkRadio.id;
      console.log(doneList);
      localStorage.setItem("doneList", JSON.stringify(doneList));
      $("#submitCheck")
        .fadeOut(100)
        .fadeIn(200)
        .fadeOut(100)
        .fadeIn(200)
        .fadeOut(100)
        .fadeIn(100);
      currentQuestion += 1;
      btnFunction(currentQuestion);
    }
  } else {
    currentQuestion += 1;
    btnFunction(currentQuestion);
  }
}
