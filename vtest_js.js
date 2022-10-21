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

// setTimeout(function () {
//   document
//     .getElementsByClassName("progress-bar")[0]
//     .setAttribute("style", "width:" + 100 + "%");

//   document.getElementById("jsData").innerHTML = "Test is ready. Good Luck!";
//   document
//     .getElementById("startBtn")
//     .classList.remove("d-none", "btn-secondary");
//   document.getElementById("startBtn").classList.add("btn-outline-warning");
// }, 2000);

function hideMainDiv() {
  document.getElementById("mainDiv").classList.add("d-none");
  document.getElementById("testDiv").classList.remove("d-none");
  startime();
}

var myVar;
var timeLeft = 3000000;
var countDownDate;

function startTimer() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  document.getElementById("demo").innerHTML =
    hours + "h " + minutes + "m " + seconds + "s ";
  if (distance < 0) {
    clearInterval(countDownDate);
    clearInterval(myVar);
    document.getElementById("demo").innerHTML = "TIME'S UP";
    // document.getElementById("testDiv").classList.add("d-none");
    // document.getElementById("resultbox").classList.remove("d-none");
    // showResults()
  }
  timeLeft -= 1000;
  // localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
  // console.log(localStorage.getItem('timeLeft'))
}

function startime() {
  myVar = setInterval(startTimer, 1000);
  countDownDate = Date.now() + timeLeft;
}

function lvlsend(productId, action) {
  console.log("updateStar Fired");
  var url = "/lvltest";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ score: productId, action: end }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("data:", data);
    });
}

var apiJson = [];
var grammarApi = ["api empty"];
var grammarOutput = [];
var levelTestSet = [];
var datalen = 0;
// function myFunction(item) {
//   if (item.tag === "Number Agreement") {
//     grammarOutput.push(item);
//     const node = document.createElement("li");
//     const textnode = document.createTextNode(item.tag);
//     node.appendChild(textnode);
//     document.getElementById("grammarbox").appendChild(node);
//   }
// }
function getGrammar() {
  fetch("https://pertinacity1.pythonanywhere.com/grammarapi")
    .then((resp) => resp.json())
    .then(function (data) {
      // console.log("Grammar Api: ", data);
      grammarApi = data;
      apiJson = data;
      datalen = data.length;

      // grammarApi.forEach(myFunction);
      //   var randData = apiJson[Math.floor(Math.random() * apiJson.length)];
      //   var rArray = [...Array(datalen).keys()];
      // console.log(rArray.length)

      document.getElementById("grammarbox").innerHTML = "api fetch completed!";

      function getRanArr(lngth) {
        let arr = [];
        do {
          let ran = Math.floor(Math.random() * lngth);
          arr = arr.indexOf(ran) > -1 ? arr : arr.concat(ran);
        } while (arr.length < lngth);

        return arr;
      }

      const res = getRanArr(datalen);
      var randomnumbers = res.slice(0, 20);

      for (let i = 0; i < randomnumbers.length; i++) {
        var rn = randomnumbers[i];
        levelTestSet.push(data[rn]);
      }
      apiJson = levelTestSet;
      console.log(levelTestSet);
      updateQuestion();

      document
        .getElementsByClassName("progress-bar")[0]
        .setAttribute("style", "width:" + 100 + "%");

      document.getElementById("jsData").innerHTML = "Test is ready. Good Luck!";
      document
        .getElementById("startBtn")
        .classList.remove("d-none", "btn-secondary");
      document.getElementById("startBtn").classList.add("btn-outline-warning");
      // document.getElementById("qCount").innerHTML = "Question   " + q + "/" + apiJson.length
      // document.getElementById("qCount").innerHTML = q + "/" + 20 + " id " + currentQuestion.id
    });
}
getGrammar();

// get range of numbers javascript & loop
// var rArray = ([...Array(60).keys()])
// for (let i = 0; i < rArray.length; i++) {
//     console.log(i)
// }

var s = document.getElementById("solution");
var a = document.getElementById("a");
var b = document.getElementById("b");
var c = document.getElementById("c");
var d = document.getElementById("d");

function showResults() {
  document.getElementById("testDiv").classList.add("d-none");
  document.getElementById("resultbox").classList.remove("d-none");

  var percentCorrectBar = correctCount.length * 20;
  document
    .getElementsByClassName("progress-bar")[2]
    .setAttribute("style", "width:" + percentCorrectBar + "%");
  document.getElementById("resultpercentagetext").innerHTML =
    percentCorrectBar + "%";

  fetti();
  //   console.log("fetti fired");
  // setTimeout(function () { window.location.href = 'https://wavecafe.pythonanywhere.com/' }, 6000);
  // $("body").fadeOut(4000, function () { window.location.href = 'https://wavecafe.pythonanywhere.com/' })
}

function showSolution() {
  s.classList.remove("d-none");
}
function hideSolution() {
  s.classList.add("d-none");
}

a.addEventListener("click", function () {
  checkAnswer(a);
});

b.addEventListener("click", function () {
  checkAnswer(b);
});

c.addEventListener("click", function () {
  checkAnswer(c);
});

d.addEventListener("click", function () {
  checkAnswer(d);
});
var correctCount = [];
var progressDone = 0;
var currentQuestion = [];
var clicked = false;
function checkAnswer(ans) {
  // console.log(currentQuestion.correct)
  // console.log(ans.dataset.id)

  if (ans.dataset.id === currentQuestion.correct) {
    ans.classList.toggle("bg-success");
    ans.classList.toggle("border-success");
    if (!correctCount.includes(q) && clicked == false) {
      correctCount.push(q);
    }
    clicked = true;
    console.log(correctCount);
    document.getElementById("noCorrect").innerHTML =
      correctCount.length + "/" + progressDone;
  } else {
    cA = document.getElementById(correctChoice);
    cA.classList.add("border-success");
    ans.classList.toggle("bg-secondary");
    ans.classList.toggle("border-danger");
    // console.log(correctChoice)
    clicked = true;
    document.getElementById("noCorrect").innerHTML =
      correctCount.length + "/" + progressDone;
  }

  showSolution();
}

var choiceA = "A";
var choiceB = "B";
var choiceC = "C";
var choiceD = "D";
var correctChoice = "X";
var q = 0;

var qbox = document.getElementById("question");
var cQuestion = "";

function loadQuestion(q) {
  if (q == 5) {
    showResults();
    //endtest // also if time runs out.
    console.log("fire show results", correctCount.length);
  }

  clicked = false;

  // var randomItem = apiJson[Math.floor(Math.random() * apiJson.length)];
  var randomItem = apiJson[q];

  currentQuestion = randomItem;
  choiceA = randomItem.choice1;
  choiceB = randomItem.choice2;
  choiceC = randomItem.choice3;
  choiceD = randomItem.choice4;
  qbox.innerHTML = randomItem.question;
  cQuestion = randomItem.question;
  document.getElementById("a").innerHTML = "A.   " + randomItem.choice1;
  document.getElementById("b").innerHTML = "B.   " + randomItem.choice2;
  document.getElementById("c").innerHTML = "C.   " + randomItem.choice3;
  document.getElementById("d").innerHTML = "D.   " + randomItem.choice4;
  a.dataset.id = randomItem.choice1;
  b.dataset.id = randomItem.choice2;
  c.dataset.id = randomItem.choice3;
  d.dataset.id = randomItem.choice4;
  if (randomItem.choice1 === randomItem.correct) {
    correctChoice = "a";
  } else if (randomItem.choice2 === randomItem.correct) {
    correctChoice = "b";
  } else if (randomItem.choice3 === randomItem.correct) {
    correctChoice = "c";
  } else if (randomItem.choice4 === randomItem.correct) {
    correctChoice = "d";
  }
  document.getElementById("solution").innerHTML =
    "Solution: " +
    randomItem.solution +
    `<h6 class="text-primary my-3  ">
        
        
        <a href="/wistia.html" class="text-decoration-none" >${randomItem.tag}</a>
        
        
        </h6>`;
  document.getElementById("qCount").innerHTML =
    q +
    1 +
    "/" +
    20 +
    " id " +
    currentQuestion.id +
    "_" +
    currentQuestion.correct;
}
// loadQuestion(q)
document.getElementById("next").addEventListener("click", updateQuestion);

function updateQuestion() {
  progressDone += 20;
  document
    .getElementsByClassName("progress-bar")[1]
    .setAttribute("style", "width:" + progressDone + "%");

  a.classList.remove(
    "bg-success",
    "border-success",
    "bg-secondary",
    "border-secondary",
    "border-danger"
  );
  b.classList.remove(
    "bg-success",
    "border-success",
    "bg-secondary",
    "border-secondary",
    "border-danger"
  );
  c.classList.remove(
    "bg-success",
    "border-success",
    "bg-secondary",
    "border-secondary",
    "border-danger"
  );
  d.classList.remove(
    "bg-success",
    "border-success",
    "bg-secondary",
    "border-secondary",
    "border-danger"
  );
  hideSolution();
  loadQuestion(q);
  q += 1;
}
