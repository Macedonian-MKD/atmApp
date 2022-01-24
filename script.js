const account1 = {
  owner: 'Aleksandro Milenkov',
  movements: [200, 455.23, -306.5, 843.25, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2020-05-23T07:42:02.383Z',
    '2020-08-28T09:15:04.904Z',
    '2020-10-01T10:17:24.185Z',
    '2021-01-08T14:11:59.604Z',
    '2022-01-20T17:01:17.194Z',
    '2022-01-22T23:36:17.929Z',
    '2022-01-24T10:51:36.790Z',
  ],
  currency: 'MKD',
  locale: 'bg-BG', // de-DE
};

const account2 = {
  owner: 'Simona Hristova',
  movements: [5000, 3400, -150, -790, -3210, -1000, 2500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2022-01-20T14:43:26.374Z',
    '2022-01-23T18:49:59.371Z',
    '2022-01-24T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Petko Petkov',
  movements: [213, 22, -49.3, -342.12, -38.8, -23.44, 380.42, -42],
  interestRate: 1.24,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2022-01-20T14:43:26.374Z',
    '2022-01-23T18:49:59.371Z',
    '2022-01-24T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'bg-BG',
};
const account4 = {
  owner: 'Andres Villas Boas',
  movements: [2311, 325.32, -94, -49, -3210, -1000, 320, -20],
  interestRate: 1.82,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2022-01-20T14:43:26.374Z',
    '2022-01-23T18:49:59.371Z',
    '2022-01-24T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.nav__welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.currentBalance');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');
const help = document.querySelector('.help');
const modalClose = document.querySelector('.modal__close');
help.addEventListener('click', function () {
  backdrop.classList.add('open');
  modal.classList.add('open');
});
backdrop.addEventListener('click', function () {
  modal.classList.remove('open');
  backdrop.classList.remove('open');
});
modalClose.addEventListener('click', function () {
  modal.classList.remove('open');
  backdrop.classList.remove('open');
});

let currentAccount, timer; // global variables
//Functions
const createUsernames = function (accs) {
  accs.forEach((val) => {
    const username = val.owner
      .toLowerCase()
      .split(' ')
      .map((word) => word[0])
      .join('');
    val.username = username;
  });
};
createUsernames(accounts);

const formatCurrency = function (amount, currency, locale) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return Intl.NumberFormat(locale, options).format(amount);
};

const formatMovementDate = function (date, locale) {
  const calculateDays = (date1, date2) => {
    return Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  };
  const daysPassed = calculateDays(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed > 1 && daysPassed <= 7) return `${daysPassed} days ago.`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sorted = false) {
  containerMovements.innerHTML = '';
  const movements = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movements.forEach((movement, index) => {
    const dw = movement > 0 ? 'deposit' : 'withdrawal';
    const displayDate = new Date(acc.movementsDates[index]);
    const finalDate = formatMovementDate(displayDate, acc.locale);
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${dw}">${index + 1} ${dw}</div>
    <div class="movements__date">${finalDate}</div>
    <div class="movements__value">${formatCurrency(
      movement,
      acc.currency,
      acc.locale
    )}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, val) => acc + val, 0);
  acc.balance = balance;
  labelBalance.textContent = formatCurrency(balance, acc.currency, acc.locale);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((move) => move > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.currency, acc.locale);
  const outcomes = acc.movements
    .filter((val) => val < 0)
    .reduce((acc, val) => acc + val, 0);

  labelSumOut.textContent = formatCurrency(
    Math.abs(outcomes),
    acc.currency,
    acc.locale
  );
  const interests = acc.movements
    .filter((move) => move > 0)
    .map((val) => (val * acc.interestRate) / 100)
    .filter((val) => val >= 1)
    .reduce((acc, val) => acc + val, 0);
  labelSumInterest.textContent = formatCurrency(
    interests,
    acc.currency,
    acc.locale
  );
};

const putDates = function (acc) {
  const now = new Date().toISOString();
  acc.movementsDates.push(now);
};

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogoutTimer = function (timer) {
  let time = 300;
  const logoutTimer = setInterval(() => {
    let minutes = Math.trunc(time / 60)
      .toString()
      .padStart(2, '0');
    let seconds = (time % 60).toString().padStart(2, '0');
    labelTimer.textContent = `${minutes}:${seconds}`;
    time--;
    if (time === -1) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
  }, 1000);
  return logoutTimer;
};
//Event Listeners
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back ${currentAccount.owner
      .split(' ')
      .splice(0, 1)}`;
    containerApp.style['opacity'] = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //UpdateUI
    updateUI(currentAccount);
    //Update Date
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(new Date());
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
  } else {
    alert('Wrong username or PIN');
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    (val) => val.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;
  if (
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username &&
    amount <= currentAccount.balance &&
    amount > 0
  ) {
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    putDates(currentAccount);
    putDates(receiverAcc);
    updateUI(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    clearInterval(timer);
    timer = startLogoutTimer();
  } else {
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    alert('Wrong username or amount');
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    putDates(currentAccount);
    setInterval(() => {
      clearInterval(timer);
      timer = startLogoutTimer();
      updateUI(currentAccount);
    }, 2500);
  } else {
    alert('Wrong amount');
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const ind = accounts.findIndex(
      (val) => val.username === inputCloseUsername.value
    );
    accounts.splice(ind, 1);
    containerApp.style['opacity'] = 0;
    labelWelcome.textContent = 'Login to get started';
  } else {
    alert('Wrong username or PIN');
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
