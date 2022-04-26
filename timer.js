function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
var csrftoken = getCookie("csrftoken");
var startbutton = document.getElementById("startbutton");
var startbutton2 = document.getElementById("startbutton2");
var learnbutton = document.getElementById("learnbutton");
var startcore = document.getElementById("startcore");
var audio = document.getElementById("audio");

var audio2 = document.getElementById("audio2");
var audio3 = document.getElementById("audio3");
var lset = localStorage.getItem("set");
var aaa = lset;

var localuserid = localStorage.getItem("userid");
console.log(localuserid);

localStorage.setItem("etype", "eflash");

var cattower = 0;

var audioonoff = localStorage.getItem("soundonoff");

var playword = "";

var wordbold = document.getElementsByClassName("wordstrong");
for (var i = 0; i < wordbold.length; i++) {
  wordbold[i].style.color = "#FFA900";
}

poopindex = 0;

startbutton.addEventListener("click", function () {
  location.reload();
  localStorage.setItem("etype", "eflash");
  localStorage.setItem("wordbank", "off");
  window.location.href = "http://127.0.0.1:8000/flashcard2";
});

startbutton2.addEventListener("click", function () {
  location.reload();
  localStorage.setItem("etype", "eflash");
  localStorage.setItem("wordbank", "on");
  window.location.href = "http://127.0.0.1:8000/flashcard";
});

learnbutton.addEventListener("click", function () {
  location.reload();
  localStorage.setItem("etype", "eflash");
  window.location.href = "http://127.0.0.1:8000/flashcardlearn";
});

startcore.addEventListener("click", function () {
  console.log("herro");
});

setTimeout(function () {
  startprogram();
}, 10);

function startprogram() {
  var wordgroup2 = [];
  var wordgroup = [];
  var activityname = "default";
  var actid = 0;

  var bankstatus = localStorage.getItem("wordbank");
  console.log(bankstatus);
  if (bankstatus == "off") {
    $("#bankbox").fadeOut(5000);
  }

  var bonuspoints = 100;
  if (bankstatus == "off") {
    bonuspoints = 150;
  }

  //fix to just use api later on

  var tpoint = 0;

  function getscore() {
    var wrapper = document.getElementById("loopbox3");
    fetch("http://127.0.0.1:8000/userpointapiview")
      .then((resp) => resp.json())
      .then(function (data) {
        //        console.log('userpoints: ', data)
        var list = data;
        console.log(localuserid);
        for (var x in list) {
          if (list[x].student == localuserid) tpoint += list[x].point;
          //                console.log(tpoint)
        }
      })
      .then(function () {
        console.log(tpoint);

        //                wrapper.innerHTML += ` ${tpoint}`;
      });
  }

  getscore();

  function getwordvalue(callback) {
    var wrapper = document.getElementById("loopbox2");
    fetch("http://127.0.0.1:8000/api")
      .then((resp) => resp.json())
      .then(function (data) {
        //        console.log('wordbank: ', data)
        var list = data;
        console.log(wordgroup2);
        var flashwords = list.filter((i) => wordgroup2.includes(i.id));
        wordgroup = flashwords;
        console.log(flashwords);
        console.log(wordgroup);
        for (var i in flashwords) {
          var item2 = `
             <strong>${flashwords[i].vocab} &middot; </strong>`;
          wrapper.innerHTML += item2;
        }
        callback();
      });
  }

  function buildlist(callback) {
    var wrapper = document.getElementById("loopbox");
    var settt = document.getElementById("settitle");
    var url = "http://127.0.0.1:8000/apisetdetail/" + aaa;
    fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
        console.log("corelist: ", data);
        var list = data;
        activityname = list.setName;
        actid = list.id;
        settt.innerHTML = "**" + list.setName + "";
        wordgroup2 = list.vocab;
        //            wrapper.innerHTML += wordgroup2;
        //word id
        callback(checklist);
      });
  }

  buildlist(getwordvalue);

  var item = [];
  var popindex = 0;
  let i = 10;
  count = 0;

  function getIndex(search) {
    return search.vocab === item[0].vocab;
  }
  function checklist() {
    $("#startbutton").hide();
    $("#startbutton2").hide();
    $("#learnbutton").hide();
    //        if (poopindex == 15) {
    //            alert("that's a lot of poo!")
    //
    //        }

    timeStart();
    console.log(wordgroup);
    var randomItem = wordgroup[Math.floor(Math.random() * wordgroup.length)];
    console.log(randomItem);
    $("#title").html(randomItem.meaning);
    console.log("sound vocab: " + randomItem.vocab);
    playword = randomItem.vocab;

    item.push(randomItem);
    count = wordgroup.length;
    var barcount = "&#10074; ";
    document.getElementById("rembar").innerHTML = barcount.repeat(count);
    popindex = wordgroup.findIndex(getIndex);
    //            item.forEach(wordloop);
    $("#worddisplay").html(`<i class="bi bi-receipt-cutoff text-info">
        </i>Words Left: <span class="text-light">${count}</span>`);
    console.log(wordgroup);
  }
  function wordloop(word, index) {
    document.getElementById("wordlist").innerHTML +=
      index + ": " + word.vocab + ", ";
  }

  var student = localuserid;
  var coreset = aaa;
  var correct = 0;
  var incorrect = 0;
  var donedate = new Date();
  var incorrectwords = [];
  var result1 = 0;
  var result3 = 0;

  var wrong = 0;

  var donedate2 = donedate.toLocaleString();

  var addsetpoint = function () {
    var url = "/userstatdata2api";
    console.log(activityname);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        student: student,
        coreset: activityname,
        correct: result3,
        donedate: donedate,
        tpoint: tpoint,
        type: "flash",
        actid: actid,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
      });
  };

  var addsetcompletestat = function () {
    var url = "/flashcardrecord2api";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        student: student,
        coreset: coreset,
        correct: correct,
        incorrect: incorrect,
        donedate: donedate,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
      });
  };

  let ti = 0;

  let basetime = 100;
  let minutes = 0;
  let seconds = 0;
  let intervalID;

  function timeStart() {
    intervalID = setInterval(function () {
      seconds += 1;
      ti += 1;
      var timedown = basetime - ti * 3.33;

      document
        .getElementsByClassName("progress-bar")[0]
        .setAttribute("style", "width:" + timedown + "%");

      if (seconds <= 9) {
        $("#countdown").html("&#9200; " + minutes + ":0" + seconds);
        //        $("#countdown").html('&#9200; 00:0'+ seconds);
      } else {
        $("#countdown").html("&#9200; " + minutes + ":" + seconds);
      }

      if (ti == 30) {
        timeEnd();
        $("#myform").submit();
        ti = 0;
      }

      if (seconds == 60) {
        minutes++;
        $("#countdown").html("&#9200; " + minutes + ":" + "00");
        seconds = 0;
      }
    }, 1000);
  }

  function timeEnd() {
    clearInterval(intervalID);
  }

  if (audioonoff == "on") {
    document.getElementById("vehicle1").checked = true;
  }

  $("#myform").submit(function (e) {
    e.preventDefault();
    var checkBox = document.getElementById("vehicle1");
    if (checkBox.checked != false) {
      console.log(" sound  play");
      //           setTimeout(function(){  audio3.play();            }, 500);

      var vocabsound = "separatism";

      console.log(playword);

      var audiosrc =
        "https://www.pythonanywhere.com/user/pertinacity1/files/home/pertinacity1/peakdelta/deltacrm/static/vocaudio/" +
        `${playword}.mp3`;

      try {
        var audio4 = new Audio(audiosrc);

        audio4.play();
      } catch (err) {
        console.log("ERRRR RRRRRRRRRRRRRR" + err);
      }

      localStorage.setItem("soundonoff", "on");
    } else {
      console.log("sound no play");
      localStorage.setItem("soundonoff", "off");
    }

    var textinput = $("#fname").val().trim().toLowerCase();
    i = 0;

    if (textinput == item[0].vocab) {
      console.log("good job");
      // if specific color toggle
      cattower++;
      $("#cattower").text("cattower " + cattower);

      if (cattower <= -2) {
        var catimg = `<img src="static/images/catminus.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 5%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == -1) {
        var catimg = `<img src="static/images/catsad.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 0) {
        var catimg = `<img src="static/images/catprofile.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 1) {
        var catimg = `<img src="static/images/catprofile0.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 2) {
        var catimg = `<img src="static/images/catprofile2.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 3) {
        var catimg = `<img src="static/images/catprofile3.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 4) {
        var catimg = `<img src="static/images/catprofile4.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 5) {
        var catimg = `<img src="static/images/catprofile5.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 6) {
        var catimg = `<img src="static/images/catprofile6.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      }

      $("#myform").keydown(function () {
        $("#wordtyped").html("---").fadeIn(2000).css("opacity", "1");
      });

      $("#barbar")
        .fadeOut(100)
        .fadeIn(100)
        .fadeOut(100)
        .fadeIn(100)
        .fadeOut(100)
        .fadeIn(100);

      audio.play();
      $.when(
        $("#wordtyped").html(
          `<span class='text-success'> ${item[0].vocab} </span> `
        )
      ).done(function () {
        //          setTimeout(function(){ $("#wordtyped").html('---').fadeIn(2000).css('opacity','1'); }, 3000);
      });

      $("#myform")[0].reset();
      $("#loopbox3").append('<i class="fas fa-check text-success"></i> ');
      timeEnd();
      ti = 0;

      correct += 1;
      item.pop();
      console.log("wordgroup " + item.length);
      console.log("popindex: " + popindex);
      console.log(count);
      if (count == 1) {
        $("#startcore").attr("disabled", true);

        var result2 = correct / (correct + wrong);

        result3 = parseInt(result2 * bonuspoints);
        tpoint = tpoint + result3;

        //                addsetcompletestat ();
        addsetpoint();

        //                      fetti();

        //                      var result2 = (correct - incorrect)/correct;

        result1 = parseInt(result2 * 100);
        console.log(result1);
        var donedate2 = donedate.toLocaleString();

        console.log(correct, incorrect, result1);
        localStorage.setItem("correct", correct);
        localStorage.setItem("incorrect", incorrect);
        localStorage.setItem("result1", result1);
        localStorage.setItem("result3", result3);

        localStorage.setItem("donedate", donedate2);
        localStorage.setItem("incorrectwords", JSON.stringify(incorrectwords));

        if (result1 >= 70) {
          fetti();
          setTimeout(function () {
            window.location.href = "http://127.0.0.1:8000/flashcardendbase";
          }, 4000);
        } else {
          $("body").fadeOut(4000, function () {
            window.location.href = "http://127.0.0.1:8000/flashcardendbase";
          });
        }

        //find out id of flashcardendview from last of user practice?
        //perhaps don't need from api, but just from js... data is recorded in the backend anyway
        setTimeout(function () {
          window.location.href = "http://127.0.0.1:8000/flashcardendbase";
        }, 4000);
      }
      wordgroup.splice(popindex, 1);
      checklist();
    } else if (count == 50) {
      setTimeout(function () {
        window.location.href = "http://127.0.0.1:8000/";
      }, 1000);
    } else {
      cattower--;
      $("#cattower").text("cattower " + cattower);

      if (cattower <= -2) {
        var catimg = `<img src="static/images/catminus.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == -1) {
        var catimg = `<img src="static/images/catsad.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 0) {
        var catimg = `<img src="static/images/catprofile.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 1) {
        var catimg = `<img src="static/images/catprofile0.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 2) {
        var catimg = `<img src="static/images/catprofile2.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 3) {
        var catimg = `<img src="static/images/catprofile3.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 4) {
        var catimg = `<img src="static/images/catprofile4.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 5) {
        var catimg = `<img src="static/images/catprofile5.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      } else if (cattower == 6) {
        var catimg = `<img src="static/images/catprofile6.jpg" style='height: 100%; width: 100%; object-fit: contain;border-radius: 0%;'>`;
        var towerdiv = document.getElementById("towerdiv");
        towerdiv.innerHTML = catimg;
      }

      $("#myform").keydown(function () {
        $("#wordtyped").html("---").fadeIn(2000).css("opacity", "1");
      });

      poopindex += 1;
      $.when(
        $("#wordtyped")
          .html(`<span class='text-danger'>${textinput} </span> -- <span class='text-info'>
                ${item[0].vocab} </span> `)
      ).done(function () {
        //          setTimeout(function(){ $("#wordtyped").html('---').fadeIn(2000).css('opacity','1'); }, 2000);
        //          $("#wordtyped").html('---');
      });
      $("#boxbox").css({ "background-color": "red" });
      setTimeout(() => {
        $("#boxbox").css({ "background-color": "#262626" });
      }, 700);

      timeEnd();
      ti = 0;

      $("#myform")[0].reset();
      $("#loopbox3").append(
        '<i class="fas fa-poo" style="color:#8B4513"></i> '
      );
      incorrect += 1;
      wrong += 1;

      wordgroup.push(item[0]);
      incorrectwords.push(item[0]);

      for (x in incorrectwords) {
        console.log("incorrect: " + incorrectwords[x].id);
      }
      item.pop();
      checklist();
    }
  });
}

//confetti

("use strict");

function fetti() {
  // If set to true, the user must press
  // UP UP DOWN ODWN LEFT RIGHT LEFT RIGHT A B
  // to trigger the confetti with a random color theme.
  // Otherwise the confetti constantly falls.
  var onlyOnKonami = false;

  $(function () {
    // Globals
    var $window = $(window),
      random = Math.random,
      cos = Math.cos,
      sin = Math.sin,
      PI = Math.PI,
      PI2 = PI * 2,
      timer = undefined,
      frame = undefined,
      confetti = [];

    var runFor = 2000;
    var isRunning = true;

    setTimeout(() => {
      isRunning = false;
    }, runFor);

    // Settings
    var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
      pointer = 0;

    var particles = 150,
      spread = 20,
      sizeMin = 5,
      sizeMax = 12 - sizeMin,
      eccentricity = 10,
      deviation = 100,
      dxThetaMin = -0.1,
      dxThetaMax = -dxThetaMin - dxThetaMin,
      dyMin = 0.13,
      dyMax = 0.18,
      dThetaMin = 0.4,
      dThetaMax = 0.7 - dThetaMin;

    var colorThemes = [
      function () {
        return color(
          (200 * random()) | 0,
          (200 * random()) | 0,
          (200 * random()) | 0
        );
      },
      function () {
        var black = (200 * random()) | 0;
        return color(200, black, black);
      },
      function () {
        var black = (200 * random()) | 0;
        return color(black, 200, black);
      },
      function () {
        var black = (200 * random()) | 0;
        return color(black, black, 200);
      },
      function () {
        return color(200, 100, (200 * random()) | 0);
      },
      function () {
        return color((200 * random()) | 0, 200, 200);
      },
      function () {
        var black = (256 * random()) | 0;
        return color(black, black, black);
      },
      function () {
        return colorThemes[random() < 0.5 ? 1 : 2]();
      },
      function () {
        return colorThemes[random() < 0.5 ? 3 : 5]();
      },
      function () {
        return colorThemes[random() < 0.5 ? 2 : 4]();
      },
    ];
    function color(r, g, b) {
      return "rgb(" + r + "," + g + "," + b + ")";
    }

    // Cosine interpolation
    function interpolation(a, b, t) {
      return ((1 - cos(PI * t)) / 2) * (b - a) + a;
    }

    // Create a 1D Maximal Poisson Disc over [0, 1]
    var radius = 1 / eccentricity,
      radius2 = radius + radius;
    function createPoisson() {
      // domain is the set of points which are still available to pick from
      // D = union{ [d_i, d_i+1] | i is even }
      var domain = [radius, 1 - radius],
        measure = 1 - radius2,
        spline = [0, 1];
      while (measure) {
        var dart = measure * random(),
          i,
          l,
          interval,
          a,
          b,
          c,
          d;

        // Find where dart lies
        for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
          (a = domain[i]), (b = domain[i + 1]), (interval = b - a);
          if (dart < measure + interval) {
            spline.push((dart += a - measure));
            break;
          }
          measure += interval;
        }
        (c = dart - radius), (d = dart + radius);

        // Update the domain
        for (i = domain.length - 1; i > 0; i -= 2) {
          (l = i - 1), (a = domain[l]), (b = domain[i]);
          // c---d          c---d  Do nothing
          //   c-----d  c-----d    Move interior
          //   c--------------d    Delete interval
          //         c--d          Split interval
          //       a------b
          if (a >= c && a < d)
            if (b > d) domain[l] = d; // Move interior (Left case)
            else domain.splice(l, 2);
          // Delete interval
          else if (a < c && b > c)
            if (b <= d) domain[i] = c; // Move interior (Right case)
            else domain.splice(i, 0, c, d); // Split interval
        }

        // Re-measure the domain
        for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
          measure += domain[i + 1] - domain[i];
      }

      return spline.sort();
    }

    // Create the overarching container
    var container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "0";
    container.style.overflow = "visible";
    container.style.zIndex = "9999";

    // Confetto constructor
    function Confetto(theme) {
      this.frame = 0;
      this.outer = document.createElement("div");
      this.inner = document.createElement("div");
      this.outer.appendChild(this.inner);

      var outerStyle = this.outer.style,
        innerStyle = this.inner.style;
      outerStyle.position = "absolute";
      outerStyle.width = sizeMin + sizeMax * random() + "px";
      outerStyle.height = sizeMin + sizeMax * random() + "px";
      innerStyle.width = "100%";
      innerStyle.height = "100%";
      innerStyle.backgroundColor = theme();

      outerStyle.perspective = "50px";
      outerStyle.transform = "rotate(" + 360 * random() + "deg)";
      this.axis =
        "rotate3D(" + cos(360 * random()) + "," + cos(360 * random()) + ",0,";
      this.theta = 360 * random();
      this.dTheta = dThetaMin + dThetaMax * random();
      innerStyle.transform = this.axis + this.theta + "deg)";

      this.x = $window.width() * random();
      this.y = -deviation;
      this.dx = sin(dxThetaMin + dxThetaMax * random());
      this.dy = dyMin + dyMax * random();
      outerStyle.left = this.x + "px";
      outerStyle.top = this.y + "px";

      // Create the periodic spline
      this.splineX = createPoisson();
      this.splineY = [];
      for (var i = 1, l = this.splineX.length - 1; i < l; ++i)
        this.splineY[i] = deviation * random();
      this.splineY[0] = this.splineY[l] = deviation * random();

      this.update = function (height, delta) {
        this.frame += delta;
        this.x += this.dx * delta;
        this.y += this.dy * delta;
        this.theta += this.dTheta * delta;

        // Compute spline and convert to polar
        var phi = (this.frame % 7777) / 7777,
          i = 0,
          j = 1;
        while (phi >= this.splineX[j]) i = j++;
        var rho = interpolation(
          this.splineY[i],
          this.splineY[j],
          (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
        );
        phi *= PI2;

        outerStyle.left = this.x + rho * cos(phi) + "px";
        outerStyle.top = this.y + rho * sin(phi) + "px";
        innerStyle.transform = this.axis + this.theta + "deg)";
        return this.y > height + deviation;
      };
    }

    function poof() {
      if (!frame) {
        // Append the container
        document.body.appendChild(container);

        // Add confetti

        var theme =
            colorThemes[onlyOnKonami ? (colorThemes.length * random()) | 0 : 0],
          count = 0;

        (function addConfetto() {
          if (onlyOnKonami && ++count > particles) return (timer = undefined);

          if (isRunning) {
            var confetto = new Confetto(theme);
            confetti.push(confetto);

            container.appendChild(confetto.outer);
            timer = setTimeout(addConfetto, spread * random());
          }
        })(0);

        // Start the loop
        var prev = undefined;
        requestAnimationFrame(function loop(timestamp) {
          var delta = prev ? timestamp - prev : 0;
          prev = timestamp;
          var height = $window.height();

          for (var i = confetti.length - 1; i >= 0; --i) {
            if (confetti[i].update(height, delta)) {
              container.removeChild(confetti[i].outer);
              confetti.splice(i, 1);
            }
          }

          if (timer || confetti.length)
            return (frame = requestAnimationFrame(loop));

          // Cleanup
          document.body.removeChild(container);
          frame = undefined;
        });
      }
    }

    $window.keydown(function (event) {
      pointer =
        konami[pointer] === event.which
          ? pointer + 1
          : +(event.which === konami[0]);
      if (pointer === konami.length) {
        pointer = 0;
        poof();
      }
    });

    if (!onlyOnKonami) poof();
  });
}

var redo = document.getElementById("redo");
redo.addEventListener("click", function () {
  location.reload();
});
