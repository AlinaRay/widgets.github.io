"use strict";

function init() {
  var SELECTORS = {
    section: '[data-section]',
    scrollTo: '[data-scroll-to]',
    scrollDir: '[data-scroll-dir]'
  };
  var sectionsArray = Array.from(document.querySelectorAll(SELECTORS.section));
  var scrollToElements = document.querySelectorAll(SELECTORS.scrollTo);
  var scrollDirElements = document.querySelectorAll(SELECTORS.scrollDir);
  var currentSectionIndex = 0;

  var getScrollTarget = function getScrollTarget(dir) {
    if (dir === 'prev' && currentSectionIndex > 0) {
      currentSectionIndex--;
      return sectionsArray[currentSectionIndex];
    }

    if (dir === 'next' && currentSectionIndex < sectionsArray.length - 1) {
      currentSectionIndex++;
      return sectionsArray[currentSectionIndex];
    }

    return false;
  };

  scrollDirElements.forEach(function (el) {
    el.addEventListener('click', function () {
      var direction = el.dataset.scrollDir;
      var target = getScrollTarget(direction);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  scrollToElements.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = el.getAttribute('href');
      var target = document.querySelector(targetId);

      if (target) {
        sectionsArray.forEach(function (section, index) {
          if (section.id === targetId.replace('#', '')) {
            currentSectionIndex = index;
          }
        });
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
} //calendar


var date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    yearCounter = year,
    monthCounter = month,
    calendarThead = document.getElementById('CALENDAR__THEAD'),
    calendarTbody = document.getElementById('CALENDAR__TBODY'),
    calendarControls = document.getElementById('CALENDAR__CONTROLS'),
    monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    formatMonth;

var getDaysInMonth = function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
};

function monthStartDay(thisYear, thisMonth) {
  var date = new Date(thisYear, thisMonth, 1);
  var startDay = date.getDay();

  if (startDay == 0) {
    startDay = 7;
  }

  return startDay;
}

function renderControls(target, year, month) {
  var controlWrapper = document.createElement('div'),
      prevBtn = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      prevIcn = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      nextBtn = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      nextIcn = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      todayBtn = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      todayIcn = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
      titleEl = document.createElement('div'),
      heading = document.createElement('header'),
      title = document.createElement('h3');
  prevIcn.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#arrow');
  nextIcn.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#arrow');
  todayIcn.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#working');
  titleEl.setAttribute('class', 'flexy__child');
  prevBtn.setAttribute('id', 'CALENDAR__CONTROLS__PREV');
  nextBtn.setAttribute('id', 'CALENDAR__CONTROLS__NEXT');
  controlWrapper.setAttribute('class', 'flexy__item  flexy--between');
  prevBtn.setAttribute('class', 'calendar__controls__button svg-icon');
  todayBtn.setAttribute('class', 'calendar__controls__button svg-icon');
  nextBtn.setAttribute('class', 'calendar__controls__button svg-icon svg-icon--rotated-180');
  title.innerHTML = '<span class="calendar__controls__button__month">' + monthNames[month] + '</span>' + '<span class="calendar__controls__button__year">' + year + '</span>';
  heading.appendChild(title);
  titleEl.appendChild(heading);
  prevBtn.appendChild(prevIcn);
  todayBtn.appendChild(todayIcn);
  nextBtn.appendChild(nextIcn);
  controlWrapper.appendChild(prevBtn);
  controlWrapper.appendChild(todayBtn);
  controlWrapper.appendChild(nextBtn);
  controlWrapper.appendChild(titleEl);
  target.innerHTML = '';
  target.appendChild(controlWrapper);
  prevBtn.addEventListener('click', changeMonth);
  nextBtn.addEventListener('click', changeMonth);
  todayBtn.addEventListener('click', goToday);
}

function renderDayNames(namesArray) {
  var namesRow = document.createElement('tr');
  namesRow.setAttribute('class', 'calendar__month__week flexy__item');

  for (var i = 0; i < namesArray.length; i++) {
    var thDay = document.createElement('th');
    thDay.setAttribute('class', 'calendar__month__day');
    thDay.innerHTML = namesArray[i];
    namesRow.appendChild(thDay);
  }

  calendarThead.appendChild(namesRow);
}

renderDayNames(dayNames);

function goToday() {
  calendarTbody.setAttribute('class', 'calendar__tbody calendar__tbody--animate');
  setTimeout(function () {
    newMonth(year, month);
  }, 450);
  setTimeout(function () {
    calendarTbody.setAttribute('class', 'calendar__tbody');
  }, 900);
  yearCounter = year;
  monthCounter = month;
}

function changeMonth() {
  if (this.id.split('NEXT').length > 1) {
    if (monthCounter < 11) {
      monthCounter++;
    } else {
      monthCounter = 0;
      yearCounter++;
    }
  } else if (this.id.split('PREV').length > 1) {
    if (monthCounter > 0) {
      monthCounter--;
    } else {
      monthCounter = 11;
      yearCounter--;
    }
  }

  calendarTbody.setAttribute('class', 'calendar__tbody calendar__tbody--animate');
  setTimeout(function () {
    newMonth(yearCounter, monthCounter);
  }, 450);
  setTimeout(function () {
    calendarTbody.setAttribute('class', 'calendar__tbody');
  }, 900);
}

function renderMonth(thisYear, thisMonth) {
  var days = getDaysInMonth(thisMonth, thisYear),
      startDay = monthStartDay(thisYear, thisMonth),
      monthRow = document.createElement('tr');
  monthRow.setAttribute('id', 'CALENDAR__ROW');
  monthRow.setAttribute('class', 'calendar__month__week flexy__item');

  for (var i = 1; i < days + startDay; i++) {
    var cellDay = document.createElement('td'),
        timeTag = document.createElement('time');
    cellDay.setAttribute('class', 'calendar__month__day');

    if (i >= startDay) {
      if (thisMonth < 10) {
        formatMonth = '0' + (thisMonth + 1);
      }

      timeTag.setAttribute('datetime', i - startDay + 1 + '/' + formatMonth + '/' + thisYear);
      cellDay.setAttribute('id', 'CALENDAR__DAY--' + (i - startDay + 1));
      timeTag.innerHTML = i - startDay + 1;
      cellDay.appendChild(timeTag);
    } else {
      cellDay.innerHTML = ' ';
    }

    monthRow.appendChild(cellDay);
  }

  calendarTbody.appendChild(monthRow);
  renderControls(calendarControls, thisYear, thisMonth);
  var today = document.getElementById('CALENDAR__DAY--' + date.getDate());

  if (thisMonth === date.getMonth() && thisYear === date.getFullYear()) {
    setTimeout(function () {
      today.setAttribute('class', 'calendar__month__day today');
    }, 200);
  }
}

function newMonth(year, month) {
  var controls = document.getElementById('CALENDAR__CONTROLS'),
      row = document.getElementById('CALENDAR__ROW');

  if (controls.firstChild) {
    controls.removeChild(controls.firstChild);
  }

  calendarTbody.removeChild(row);
  renderMonth(year, month);
}

renderMonth(year, month);
var timeInHeader = document.querySelector('.header__right > p');
var timeInSection = document.querySelector('#calendar .section__header .section__subtitle');
var todayTd;
setTimeout(function () {
  // console.log(todayTd);
  todayTd = document.querySelector('.today > time');
  console.log(todayTd);
  timeInHeader.innerHTML = "".concat(todayTd.getAttribute('datetime'), " ").concat(now.getHours(), ":").concat((now.getMinutes() < 10 ? '0' : '') + now.getMinutes());
  timeInSection.innerHTML = "".concat(todayTd.getAttribute('datetime'), "  ").concat(now.getHours(), "<span class=\"date--semicolon\">:</span>").concat((now.getMinutes() < 10 ? '0' : '') + now.getMinutes());
  console.log(todayTd.getAttribute('datetime'));
}, 300);

function weatherCall() {
  var cityId = 703447;
  var cityName = 'Kiev';
  var units = 'metric';
  var apiKey = '286e0e247b1e430ff91e8bbb945cf78d';
  var requestString = "https://api.openweathermap.org/data/2.5/weather?id=".concat(cityId, "&appid=").concat(apiKey, "&units=").concat(units);
  var request = new XMLHttpRequest();
  request.open("get", requestString, true);
  request.send();
  var weatherObject;

  request.onload = function () {
    weatherObject = JSON.parse(this.responseText);
    document.querySelector(".weather-temp").innerHTML = Math.round(weatherObject.main.temp) + ' ˚';
    document.querySelector('.weather-city').innerHTML = "Today in ".concat(cityName);
    console.log(weatherObject);
  };
} // function setImage(monthNum){
//
//     switch(monthNum){
//         case '0':
//         case '1':
//         case '2':
//             setBodyBgImage('https://images.unsplash.com/photo-1520588831435-1529e6d7cf5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1584&q=80');
//             break;
//         case '3':
//         case '4':
//         case '5':    setBodyBgImage('https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwj3o7blzurfAhXBtIsKHfqmAIMQjRx6BAgBEAU&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fbeauty%2F&psig=AOvVaw3EJ3YAKU8Xb2TXltX32AIg&ust=15474636511390220');
//             break;
//         case '6':
//         case '7':
//         case '8':    setBodyBgImage('https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiWmtv1zurfAhVssIsKHUouDhwQjRx6BAgBEAU&url=https%3A%2F%2Fwww.gettyimages.com%2F&psig=AOvVaw3EJ3YAKU8Xb2TXltX32AIg&ust=1547463651139022');
//             break;
//         case '9':
//         case '10':
//         case '11':    setBodyBgImage('https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjInbCCz-rfAhUk_CoKHZWzB4YQjRx6BAgBEAU&url=https%3A%2F%2Fwww.w3schools.com%2Fw3css%2Fw3css_images.asp&psig=AOvVaw3EJ3YAKU8Xb2TXltX32AIg&ust=1547463651139022');
//             break;
//     }
// }
//
// function setBodyBgImage(bgImage){
//     let body = document.querySelector('body');
//
//     body.style.backgroundImage = `url(${bgImage});`;
// }


weatherCall();
setInterval(weatherCall, 1000 * 60 * 5); // weatherCall();

var now = new Date();
console.log(now.getHours());
init();