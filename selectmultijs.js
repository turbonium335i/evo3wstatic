var url = "http://127.0.0.1:8000/multichoicesetapiview";
var url3 = "http://127.0.0.1:8000/multichoicesetapiview";
var url2 = "http://127.0.0.1:8000/userapiview";
var flashcardselect = document.getElementById("zero");
var student = "";
var lastpage = 1;
if (localStorage.getItem("selectmulti") !== null) {
  console.log(`exists`);
  lastpage = parseInt(localStorage.getItem("selectmulti"));
} else {
  console.log(`not found`);
  lastpage = 1;
}
var list = [];
var state = {
  querySet: list,
  page: lastpage,
  row: 8,
  window: 5,
};
function pagination(querySet, page, rows) {
  var trimStart = (page - 1) * rows;
  var trimEnd = trimStart + rows;
  var trimmedData = querySet.slice(trimStart, trimEnd);
  var pages = Math.ceil(querySet.length / rows);
  return {
    querySet: trimmedData,
    pages: pages,
  };
}
var randset = [];
function getselectset(callback) {
  fetch("http://127.0.0.1:8000/multichoicesetapiview")
    .then((resp) => resp.json())
    .then(function (data) {
      console.log("multipleset: ", data);
      state.querySet = data.reverse();
      callback();
    });
}
function loadvocab() {
  $("#apireturn").empty();
  localStorage.setItem("etype", "emulti");
  var pdata = pagination(state.querySet, state.page, state.row);
  console.log(pdata);
  list = pdata.querySet;
  console.log(list);
  console.log(checkgroup.length);
  for (var i in list) {
    var checkdone = list[i].multiqsetName;
    if (checkgroup.includes(checkdone)) {
      var item = `<h5 id="apiloopvocab"><button type="button" data-id='${list[i].id}'
        data-sname='${list[i].multiqsetName}'
        class="btn btn-outline-success btn-sm btx">Go</button>&nbsp ${list[i].multiqsetName} - ${list[i].tag}</h5>`;
      apireturn.innerHTML += item;
    } else {
      var item = `<h5 id="apiloopvocab"><button type="button" data-id='${list[i].id}'
        data-sname='${list[i].multiqsetName}'
        class="btn btn-outline-secondary btn-sm btx">Go</button>&nbsp ${list[i].multiqsetName} - ${list[i].tag}</h5>`;
      apireturn.innerHTML += item;
    }
  }
  for (var i in list) {
    var editbtn = document.getElementsByClassName("btx")[i];
    editbtn.addEventListener("click", function () {
      var wordId = this.dataset.id;
      var sname = this.dataset.sname;
      var idurl = "http://127.0.0.1:8000/multichoicego/" + wordId;
      localStorage.setItem("multisetid", wordId);
      localStorage.setItem("setname", sname);
      console.log("setname: " + sname + " id: ", wordId);
      flashcardselect.insertAdjacentHTML("beforeend", +wordId + ", " + sname);
      var getflashapi = function () {
        window.location.href = idurl;
      };
      getflashapi();
    });
  }
  function pageButtons(pages) {
    var wrapper = document.getElementById("pagination-wrapper");
    wrapper.innerHTML = ``;
    console.log("Pages:", pages);
    var maxLeft = state.page - Math.floor(state.window / 2);
    var maxRight = state.page + Math.floor(state.window / 2);
    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = state.window;
    }
    if (maxRight > pages) {
      maxLeft = pages - (state.window - 1);
      if (maxLeft < 1) {
        maxLeft = 1;
      }
      maxRight = pages;
    }
    for (var page = maxLeft; page <= maxRight; page++) {
      wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-outline-warning">${page}</button>`;
    }
    if (state.page != 1) {
      wrapper.innerHTML =
        `<button value=${1} class="page btn btn-sm btn-outline-warning" id='rebutton'>&#171; First</button>` +
        wrapper.innerHTML;
    }
    if (state.page != pages) {
      wrapper.innerHTML += `<button value=${pages} class="page btn btn-sm btn-outline-warning">Last &#187;</button>`;
    }
    var classpage = document.getElementsByClassName("btn-outline-warning");
    //                console.log(classpage)
    for (var i = 0; i < classpage.length; i++) {
      //                console.log(classpage[i])
      if (classpage[i].value == state.page) {
        var current = document.getElementsByClassName("page");
        current[i].className = current[i].className.replace(" btn-sm", "");
        current[i].className += " btn-secondary";
      }
    }
    $(".page").on("click", function () {
      $("#apireturn").empty();
      state.page = Number($(this).val());
      var multipage = state.page;
      localStorage.setItem("selectmulti", multipage);
      loadvocab();
    });
  }
  pageButtons(pdata.pages);
}
//              getselectset(loadvocab);
var statgroup = [];
var activityname = "default";
var lastflashtext = [];
var checkgroup = [];
var localuserid = localStorage.getItem("userid");
var mtally = 0;
console.log(localuserid);
function getscore(callback) {
  var wrapper = document.getElementById("loopbox5");
  var lastflash = document.getElementById("lastflash");
  fetch("http://127.0.0.1:8000/userpointapiview")
    .then((resp) => resp.json())
    .then(function (data) {
      //        console.log('data: ', data)
      var list = data;
      console.log(localuserid);
      for (var x in list) {
        if (list[x].student == localuserid && list[x].point >= 80) {
          checkgroup.push(list[x].activity);
        }
      }
      for (var x in list) {
        if (list[x].student == localuserid) {
          statgroup.push(list[x]);
        }
      }
    })
    .then(function () {
      callback(loadvocab);
      getselectset2(loadvocab2);
      //                statgroup.reverse();
      for (var x in statgroup) {
        if (statgroup[x].type == "multi") {
          console.log(statgroup[x].type);
          lastflashtext = statgroup[x];
          break;
        }
      }
      //                console.log(statgroup);
      console.log("sss" + lastflashtext.id);
      lastflash.innerHTML = `Last Completed Set: <span style="color:#f58442;font-weight:bold">
                        <button type="button" data-id='${lastflashtext.actid}'
        data-sname='${lastflashtext.activity}'
        class="btn btn-outline-success btn-sm" id="lastsetgo"><i class="fas fa-arrow-right"></i></button>
        ${lastflashtext.activity},
        score: ${lastflashtext.point}<span>`;
      //trying to link directly to last practice using the attibute function
      //lastflash.innerHTML += `<button type="button" data-id='${lastflashtext.activity}'
      //class="btn btn-outline-success btn-sm lastbutton">Go</button>
      //<span style="color:#f58442;font-weight:bold"> ${lastflashtext.activity},
      //score: ${lastflashtext.point}<span>`;
      //                var lastbutton = document.getElementsByClassName('lastbutton');
      //                lastbutton.addEventListener('click', function(){console.log(this.dataset.id);})
      //
      //                var wordId = this.dataset.id;
      //                var sname = this.dataset.sname;
      //                var idurl = 'http://127.0.0.1:8000/multichoicego/'+ wordId
      //                localStorage.setItem('multisetid', wordId);
      //                localStorage.setItem('setname', sname);
      //
      //                console.log('setname: '+ sname + ' id: ', wordId);
      //                flashcardselect.insertAdjacentHTML("beforeend",  + wordId + ', ' + sname);
      //                var getflashapi = function(){
      //                window.location.href = idurl; }
      //                getflashapi();
    })
    .then(function () {
      console.log("hello");
      for (var x in statgroup) {
        if (statgroup[x].type == "multi") {
          mtally++;
        }
      }
      //                var lastbutton = document.getElementsByClassName('lastbutton');
      //                lastbutton.addEventListener('click', function(){console.log('this.dataset.id');})
    })
    .then(function () {
      console.log(mtally);
      var lbtx = document.getElementById("lastsetgo");
      lbtx.addEventListener("click", function () {
        console.log(this.dataset.id);
        var wordId = lbtx.dataset.id;
        var sname = lbtx.dataset.sname;
        var idurl = "http://127.0.0.1:8000/multichoicego/" + wordId;
        localStorage.setItem("set", wordId);
        localStorage.setItem("setname", sname);
        console.log("setname: " + sname + " id: ", wordId);
        flashcardselect.insertAdjacentHTML("beforeend", +wordId + ", " + sname);
        var getflashapi2 = function () {
          window.location.href = idurl;
        };
        getflashapi2();
      });
      //                var tallybx = document.getElementById('tally');
      //                tallybx.innerHTML += ` ${mtally} <br>`;
      //                var i;
      //                for (i = 0; i < mtally; i++) {
      //                tallybx.innerHTML += `<span style="color:white;font-weight:bold"><i class="fas fa-cat"></i> <span>`;
      //                }
    });
}
getscore(getselectset);

const searchedbox = document.getElementById("fname2");
const searched = document.getElementById("fname");
const wrapper = document.getElementById("typed");
const searchreturn = document.getElementById("apireturn");
var groupsetpostview = document.getElementById("posthistory");
const filterTodos = (term) => {
  //        console.log(term)
  wrapper.innerHTML = "typed: " + term;
};

searchedbox.addEventListener("submit", (event) => {
  event.preventDefault();
  databank = [];
  $("#rebutton").trigger("click");
  var term = searched.value.trim().toLowerCase();
  filterTodos(term);
  getselectsetsearch(term, loadvocab);
  //            todofilter(term);
});

searchedbox.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.keyCode == 8) {
    $("#rebutton").trigger("click");
    //        document.getElementById("fname2").reset();
    getselectset(loadvocab);
  }
});

const todofilter = (term) => {
  Array.from(searchreturn.children)
    .filter((todo) => !todo.textContent.includes(term))
    .forEach((todo) => todo.classList.add("filtered"));
  Array.from(searchreturn.children)
    .filter((todo) => todo.textContent.includes(term))
    .forEach((todo) => todo.classList.remove("filtered"));
};
var databank = [];
function getselectsetsearch(term, callback) {
  fetch(url3)
    .then((resp) => resp.json())
    .then(function (data) {
      console.log("coresetapi: ", data);
      var datasearch = data;
      for (var x in datasearch) {
        if (
          datasearch[x].multiqsetName.toLowerCase().includes(term) ||
          datasearch[x].tag.toLowerCase().includes(term)
        ) {
          databank.push(datasearch[x]);
          console.log(datasearch[x].multiqsetName);
        }
      }
      state.querySet = databank.reverse();
      callback();
    });
}
//PERCENT DONE CAL
var itemdone = 0;
var result2 = 0;
var coresetcount = 0;
var donedata = [];
function getselectset2(callback) {
  fetch("http://127.0.0.1:8000/multichoicesetapiview")
    .then((resp) => resp.json())
    .then(function (data) {
      console.log("coresetapi: ", data);
      coresetcount = data.length;
      donedata = data.reverse();
      callback(fstatus);
    });
}
function loadvocab2(callback) {
  list = donedata;
  console.log(checkgroup);
  for (var i in list) {
    var checkdone = list[i].multiqsetName;
    if (checkgroup.includes(checkdone)) {
      itemdone += 1;
      //               console.log('itemdone: ' + itemdone)
    } else {
    }
    var resultraw = itemdone / coresetcount;
    //                console.log(resultraw)
    result2 = parseFloat(resultraw) * 100;
    //console.log(result2)
  }
  callback();
}
function fstatus() {
  console.log("done");
  document
    .getElementsByClassName("progress-bar")[0]
    .setAttribute("style", "width:" + result2 + "%");
}
var roottag = document.getElementById("history");
var coretag = document.getElementById("core");
roottag.addEventListener("click", () => {
  var term = "history";
  databank = [];
  $("#rebutton").trigger("click");
  $("#typed").text("Tag: History");
  getselectsetsearch(term, loadvocab);
});
coretag.addEventListener("click", () => {
  var term = "core";
  databank = [];
  $("#rebutton").trigger("click");
  $("#typed").text("Tag: Core");
  getselectsetsearch(term, loadvocab);
});
var notdone = document.getElementById("notdone");
notdone.addEventListener("click", () => {
  var term = "core";
  databank = [];
  $("#rebutton").trigger("click");
  $("#typed").text("Tag: Not Done");
  getselectnotdone(term, loadvocab);
});
$("#clear").click(function () {
  databank = [];
  $("#rebutton").trigger("click");
  $("#typed").text("Tag: Cleared");
  getselectsetsearch("", loadvocab);
  console.log("cleared");
});
function getselectnotdone(term, callback) {
  fetch("http://127.0.0.1:8000/multichoicesetapiview")
    .then((resp) => resp.json())
    .then(function (data) {
      console.log("multisetapi: ", data);
      var datasearch = data;
      for (var x in datasearch) {
        var checkdone = datasearch[x].multiqsetName;
        if (!checkgroup.includes(checkdone)) {
          databank.push(datasearch[x]);
          console.log(databank);
        }
        state.querySet = databank.reverse();
        callback();
      }
    });
}
var selrandom = document.getElementById("selrandom");
selrandom.addEventListener("click", () => {
  var term = "core";
  databank = [];
  $("#rebutton").trigger("click");
  $("#typed").text("Tag: Random");
  getselectrandom(term, loadvocab);
});
function getselectrandom(term, callback) {
  fetch("http://127.0.0.1:8000/multichoicesetapiview")
    .then((resp) => resp.json())
    .then(function (data) {
      console.log("multiset api: ", data);
      var datasearch = data;
      for (var x in datasearch) {
        randset.push(datasearch[x]);
        //                        console.log(datasearch[x].multiqsetName)
      }
      var randlist = [];
      randlist.push(random_item(randset));
      console.log("randlist: " + randlist[0].multiqsetName);
      state.querySet = randlist.reverse();
      callback();
    });
}
function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}
