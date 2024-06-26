'use strict';

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import imageUrl from '../img/alert-icon.svg'

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

// Налаштування для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

// Ініціалізація flatpickr
flatpickr(datetimePicker, options);

// Обробка натискання кнопки Start
startButton.addEventListener('click', () => {
  if (userSelectedDate) {
    startButton.disabled = true;
    datetimePicker.disabled = true;
    startTimer(userSelectedDate);
  }
});

// Функція запуску таймера
function startTimer(endDate) {
  timerId = setInterval(() => {
    const currentTime = new Date();
    const remainingTime = endDate - currentTime;

    if (remainingTime <= 0) {
      clearInterval(timerId);
      updateTimerDisplay(0, 0, 0, 0);
      iziToast.info({
        title: 'Done',
        message: 'Countdown completed!',
      });
      datetimePicker.disabled = false;
      startButton.disabled = true;
      return;
    }

    const timeComponents = convertMs(remainingTime);
    updateTimerDisplay(timeComponents.days, timeComponents.hours, timeComponents.minutes, timeComponents.seconds);
  }, 1000);
}

// Функція конвертації мілісекунд
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

// Оновлення відображення таймера
function updateTimerDisplay(days, hours, minutes, seconds) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

// Додавання провідного нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
