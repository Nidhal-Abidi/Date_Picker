/**
 * To Do:
 *  0) Add the "package.json" file
 *  1) Install the library: date-fns from npm
 *  2) Install Parcel as development dependency in order to use the library easily + to stop using live server.
 *  3) Add the script necessary for Parcel to run
 *  4) Create a ".gitignore" file where you put "node_modules", "dist" and ".cache"
 *
 *
 * Problems:
 *   1) show/hide the modal when you click on the btn(add the class '.show' to the elt with the class '.date-picker')
 *
 *   2) Once a new date is selected: a) That date should be saved(ie selected even if we move to other months), add the class '.selected' // Maybe use local storage
 *                                   b) The writing on the btn should update to this new value
 *
 * NB: Don't forget the problem of the grayed out days of the other months.
 *
 *   3) Come up with the dates for the other months(or years) + make sure if the current month is October that the dates of November and August are grayed out(add the class ".date-picker-other-month-date")
 *
 *
 */

import {
  addMonths,
  eachDayOfInterval,
  format,
  fromUnixTime,
  getDate,
  getUnixTime,
  getWeekOfMonth,
  isSameDay,
  isSameMonth,
  lastDayOfMonth,
  lastDayOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"

const datePickerBtn = document.querySelector(".date-picker-button")
const datePickerModal = document.querySelector(".date-picker")
const gridDates = document.querySelector(".date-picker-grid-dates")
const currentMonthHeader = document.querySelector(".current-month")
const nextArrow = document.querySelector(".next-month-button")
const prevArrow = document.querySelector(".prev-month-button")
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

datePickerBtn.addEventListener("click", () => {
  datePickerModal.classList.toggle("show")
})

/** 1) Add the current date to the btn + save it as a second timestamp in a data attrib */
const todaysDate = new Date()
datePickerBtn.innerText = format(todaysDate, "MMMM do, yyyy")
datePickerBtn.dataset.selectedDate = getUnixTime(todaysDate)

/** 2) Get the array that contains the dates of the current month including the grayed out ones for the prev/next months */
const arrCurrentCalendarM = getArrayCalendarM(todaysDate)

/** 3) Build the Calendar for the current Month */
displayDatesCalendarM(arrCurrentCalendarM, todaysDate)

function getArrayCalendarM(currentDate) {
  let firstDayOfCurrM = startOfWeek(startOfMonth(currentDate))
  let lastDayOfCurrM = lastDayOfWeek(lastDayOfMonth(currentDate))
  const arrCurrentCalendarM = eachDayOfInterval({
    start: firstDayOfCurrM,
    end: lastDayOfCurrM,
  })
  return arrCurrentCalendarM
}

function displayDatesCalendarM(arr, currentDate) {
  /**
   * Each day is a btn with class ".date" => Eg. <button class="date">1</button>
   * Days from the next/prev month will have an extra class called ".date-picker-other-month-date" => Eg. <button class="date date-picker-other-month-date">30</button>
   *
   * Days selected by the user will have an additional class ".selected". NB: by default the current date is the one initially selected => Eg. <button class="date selected">26</button>
   */
  /** 1) Delete all the dates from before */
  gridDates.innerHTML = ""

  let selectedDate = fromUnixTime(Number(datePickerBtn.dataset.selectedDate))

  arr.forEach((date) => {
    const dayOfM = document.createElement("button")
    dayOfM.classList.add("date")
    dayOfM.innerText = getDate(date)

    if (isSameDay(date, selectedDate)) {
      //Is selected by default
      dayOfM.classList.add("selected")
    }

    if (!isSameMonth(date, currentDate)) {
      //should have the extra class since it's from the next/prev month
      dayOfM.classList.add("date-picker-other-month-date")
    }
    gridDates.appendChild(dayOfM)
  })
  /** Add the current month and year to the header of the modal */
  currentMonthHeader.innerText = format(currentDate, "MMMM - yyyy")
}

gridDates.addEventListener("click", (e) => {
  // Pay attention to only button clicks & nothing else.
  if (!e.target.matches(".date")) return
  // Can't select days from next/prev months (For less if-conditions later)
  if (e.target.matches(".date-picker-other-month-date")) return

  let day = Number(e.target.innerText)
  let arrMonthYear = currentMonthHeader.innerText.split(" - ")
  let month = months.indexOf(arrMonthYear[0])
  let year = Number(arrMonthYear[1])
  let selectedDay = new Date(year, month, day)

  datePickerBtn.innerText = format(selectedDay, "MMMM do, yyyy")
  datePickerBtn.dataset.selectedDate = getUnixTime(selectedDay)

  let arrCalM = getArrayCalendarM(selectedDay)
  displayDatesCalendarM(arrCalM, selectedDay)
})

nextArrow.addEventListener("click", () => {
  /** I want to get the beginning of the current month so that when I add a month no unexpected bugs happen */
  let currMonthYear = currentMonthHeader.innerText.split(" - ")
  let month = months.indexOf(currMonthYear[0])
  let year = Number(currMonthYear[1])
  const dateFromNextMonth = addMonths(new Date(year, month, 1), 1)
  const arrNextMonth = getArrayCalendarM(dateFromNextMonth)
  displayDatesCalendarM(arrNextMonth, dateFromNextMonth)
})

prevArrow.addEventListener("click", () => {
  /** I want to get the beginning of the current month so that when I substract a month no unexpected bugs happen */
  let currMonthYear = currentMonthHeader.innerText.split(" - ")
  let month = months.indexOf(currMonthYear[0])
  let year = Number(currMonthYear[1])
  const dateFromPrevMonth = subMonths(new Date(year, month, 1), 1)
  const arrPrevMonth = getArrayCalendarM(dateFromPrevMonth)
  displayDatesCalendarM(arrPrevMonth, dateFromPrevMonth)
})
