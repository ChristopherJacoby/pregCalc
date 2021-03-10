//global variables
let selDate;
let p;
let p1;
let p2;
let p3;
let psub1;
let psub2;
let psub3;
let psub4;
let dateArr = [];
let evalDate;
let lmp;

$(document).ready(function () {
  var now = new Date();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  var today = now.getFullYear() + "-" + month + "-" + day;
  $("#evalDate").val(today);
});

const dateChange = () => {
  lmp = moment(document.getElementById("lmpDateSelected").value);
  selDate = moment(document.getElementById("dateSelected").value);
  evalDate = moment(document.getElementById("evalDate").value).format(
    "MM-DD-YYYY"
  );
  //26208000000 - 10 months in milliseconds
  if (Date.parse(lmp) > Date.parse(selDate)) {
    alert("The Peak Date needs to be after the LMP.");
    document.querySelector("#lmpDateSelected").value = "";
    document.querySelector("#dateSelected").value = "";
  } else if (Date.parse(evalDate) < Date.parse(selDate)) {
    alert("The Date of Evaluation needs to be after the Peak Date.");
    document.querySelector("#dateSelected").value = "";
  } else if (Date.parse(evalDate) - 26208000000 > Date.parse(selDate)) {
    alert(
      "The Date of Evaluation can't be more than 10 months after the Peak Date."
    );
    document.querySelector("#dateSelected").value = "";
  } else {
    p = moment(selDate).format("MM-DD-YYYY");
    p1 = moment(p).add(1, "days").format("MM-DD-YYYY");
    p2 = moment(p).add(2, "days").format("MM-DD-YYYY");
    p3 = moment(p).add(3, "days").format("MM-DD-YYYY");
    psub1 = moment(p).subtract(1, "days").format("MM-DD-YYYY");
    psub2 = moment(p).subtract(2, "days").format("MM-DD-YYYY");
    psub3 = moment(p).subtract(3, "days").format("MM-DD-YYYY");
    psub4 = moment(p).subtract(4, "days").format("MM-DD-YYYY");
    document.getElementById("p").textContent = p;
    document.getElementById("p-1").textContent = psub1;
    document.getElementById("p-2").textContent = psub2;
    document.getElementById("p-3").textContent = psub3;
    document.getElementById("p-4").textContent = psub4;
    document.getElementById("p1").textContent = p1;
    document.getElementById("p2").textContent = p2;
    document.getElementById("p3").textContent = p3;
    $("div.dateTable").removeClass("dateTable");
    $("div.dateBtn").addClass("dateTable");
    //Clearing Form and Array on selecting new date
    dateArr = [];
    $("div#infoHold").addClass("info");
    document.getElementById("checka").checked = false;
    document.getElementById("checkb").checked = false;
    document.getElementById("checkc").checked = false;
    document.getElementById("checkd").checked = false;
    document.getElementById("checke").checked = false;
    document.getElementById("checkf").checked = false;
    document.getElementById("checkg").checked = false;
    document.getElementById("checkh").checked = false;
  }
};

const calculate = () => {
  dateArr = [];
  if ((a = document.querySelector("#checka").checked == true)) {
    dateArr.push(psub4);
  }
  if ((b = document.querySelector("#checkb").checked == true)) {
    dateArr.push(psub3);
  }
  if ((c = document.querySelector("#checkc").checked == true)) {
    dateArr.push(psub2);
  }
  if ((d = document.querySelector("#checkd").checked == true)) {
    dateArr.push(psub1);
  }
  if ((e = document.querySelector("#checke").checked == true)) {
    dateArr.push(p);
  }
  if ((f = document.querySelector("#checkf").checked == true)) {
    dateArr.push(p1);
  }
  if ((g = document.querySelector("#checkg").checked == true)) {
    dateArr.push(p2);
  }
  if ((h = document.querySelector("#checkh").checked == true)) {
    dateArr.push(p3);
  }
  let firstDate;
  let endDate;

  //constructing array
  if (dateArr.length == 0) {
    alert("Select the date(s) of intercourse.");
  } else if (
    dateArr.length > 1 &&
    Date.parse(dateArr[dateArr.length - 1]) >= Date.parse(p)
  ) {
    firstDate = dateArr[0];
    endDate = dateArr[dateArr.length - 1];
  } else if (
    dateArr.length > 1 &&
    Date.parse(dateArr[dateArr.length - 1]) <= Date.parse(p)
  ) {
    firstDate = dateArr[0];
    endDate = p;
  } else if (dateArr.length == 1 && Date.parse(dateArr[0]) <= Date.parse(p)) {
    firstDate = dateArr[0];
    endDate = p;
  } else if (dateArr.length == 1 && Date.parse(dateArr[0]) >= Date.parse(p)) {
    firstDate = p;
    endDate = dateArr[0];
  }
  document.querySelector("#firstDate").textContent = firstDate;
  document.querySelector("#endDate").textContent = endDate;

  //calculating ETC midrange
  let mRange;
  let fDate = Date.parse(firstDate);
  let eDate = Date.parse(endDate);
  let loopDate = eDate + 86400000;

  if (fDate > Date.parse(p)) {
    mRange = moment(fDate).format("MM-DD-YYYY");
  } else {
    while (fDate <= loopDate) {
      if (fDate == eDate) {
        mRange = moment(fDate).format("MM-DD-YYYY");
        break;
      } else if (fDate > eDate) {
        if (fDate % 2 == 0) {
          mRange = moment(fDate).format("MM-DD-YYYY");
          break;
        } else {
          mRange = moment(eDate).format("MM-DD-YYYY");
          break;
        }
      }
      fDate = fDate + 86400000;
      eDate = eDate - 86400000;
    }
  }
  document.querySelector("#midRange").textContent = mRange;

  //calculating the Preg time @ evaluation
  let midPointEval = Date.parse(mRange);
  let currentTime = Date.parse(evalDate);
  let milliSecAtEval = currentTime - midPointEval;
  //1 day has 86,400,00 milliseconds.
  let daysSinceEval = milliSecAtEval / 86400000;
  let weeksAtEval = Math.floor(daysSinceEval / 7);
  let daysAtEval = Math.floor(daysSinceEval - weeksAtEval * 7);
  let week = weeksAtEval == 1 ? "week" : "weeks";
  let day = daysAtEval == 1 ? "day" : "days";
  document.querySelector(
    "#week"
  ).textContent = `${weeksAtEval} ${week} and ${daysAtEval} ${day}`;
  // document.querySelector("#weeksEval").textContent = weeksAtEval;
  // document.querySelector("#daysEval").textContent = daysAtEval;

  //calculating ETA Range
  let lowDueDate = moment(firstDate)
    .add(1, "year")
    .subtract(3, "months")
    .subtract(7, "days")
    .format("MM-DD-YYYY");
  let highDueDate = moment(endDate)
    .add(1, "year")
    .subtract(3, "months")
    .subtract(7, "days")
    .format("MM-DD-YYYY");
  document.querySelector("#lowDueDate").textContent = lowDueDate;
  document.querySelector("#highDueDate").textContent = highDueDate;

  //calculating ETA midrange.

  let etamRange = moment(mRange)
    .subtract("3", "months")
    .subtract("7", "days")
    .add("1", "year")
    .format("MM-DD-YYYY");
  // let lDate = Date.parse(lowDueDate);
  // let hDate = Date.parse(highDueDate);
  // let etaLoopDate = hDate + 86400000;

  // while (lDate <= etaLoopDate) {
  //     if (lDate == hDate) {
  //         etamRange = moment(lDate).format("MM-DD-YYYY");
  //         break;
  //     } else if (lDate > hDate) {
  //         if (lDate % 2 == 0) {
  //             etamRange = moment(lDate).format("MM-DD-YYYY");
  //             break;
  //         } else {
  //             etamRange = moment(hDate).format("MM-DD-YYYY");
  //             break;
  //         }
  //     }
  //     lDate = lDate + 86400000;
  //     hDate = hDate - 86400000;
  // }
  document.querySelector("#etamRange").textContent = etamRange;

  //Calculating LMP Date
  let lmpAtEval = Date.parse(lmp);
  let lmpMilliSecAtEval = currentTime - lmpAtEval;
  //1 day has 86,400,00 milliseconds.
  let lmpDaysSinceEval = lmpMilliSecAtEval / 86400000;
  let lmpWeeksAtEval = Math.floor(lmpDaysSinceEval / 7);
  let lmpDaysAtEval = Math.floor(lmpDaysSinceEval - lmpWeeksAtEval * 7);
  let lmpweek = lmpWeeksAtEval == 1 ? "week" : "weeks";
  let lmpday = lmpDaysAtEval == 1 ? "day" : "days";
  document.querySelector(
    "#lmpweek"
  ).textContent = `${lmpWeeksAtEval} ${lmpweek} and ${lmpDaysAtEval} ${lmpday}`;
  // document.querySelector("#lmpWeeksEval").textContent = lmpWeeksAtEval;
  // document.querySelector("#lmpDaysEval").textContent = lmpDaysAtEval;

  //calculating Nagaele's Rule and LMP duedates
  let nagRule = moment(lmp)
    .subtract("3", "months")
    .add("7", "days")
    .add("1", "year")
    .format("MM-DD-YYYY");
  let lmpETA = moment(lmp).add("280", "days").format("MM-DD-YYYY");
  document.querySelector("#nagETA").textContent = nagRule;
  document.querySelector("#lmpETA").textContent = lmpETA;

  //calculating Check in dates
  const fiveMonths = moment(mRange).add("5", "months").format("MM-DD-YYYY");
  const eightMonths = moment(mRange).add("8", "months").format("MM-DD-YYYY");
  const tenMonths = moment(mRange).add("10", "months").format("MM-DD-YYYY");
  document.querySelector(
    "#checkInDates"
  ).innerHTML = `${fiveMonths}, ${eightMonths}, ${tenMonths}`;

  //remove hidden class
  if (dateArr.length > 0 && lmpAtEval) {
    $("div.info").removeClass("info");
  }
};
