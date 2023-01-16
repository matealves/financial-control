const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  render();
};

const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? "-" : "+";
  const CSSClas = amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(amount).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  const li = document.createElement("li");

  li.classList.add(CSSClas);
  li.innerHTML = `${name} <span>${operator}
  ${amountWithoutOperator}</span><button class="delete-btn"
   onClick="removeTransaction(${id})"><box-icon class="trash" type='solid' name='trash'></box-icon></i></button>`;

  transactionsUl.append(li);
};

const getExpenses = (transactionsAmount) =>
  transactionsAmount
    .filter((value) => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0);

const getIncomes = (transactionsAmount) =>
  transactionsAmount
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0);

const getTotal = (transactionsAmount) =>
  transactionsAmount.reduce(
    (accumulator, transaction) => accumulator + transaction,
    0
  );

const updateBalanceValues = () => {
  const transactionsAmount = transactions.map(({ amount }) => amount);
  const total = getTotal(transactionsAmount);
  const income = getIncomes(transactionsAmount);
  const expense = getExpenses(transactionsAmount);

  balanceDisplay.textContent = total.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  incomeDisplay.textContent = income.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  expenseDisplay.textContent = expense.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  Math.abs(expense) > income
    ? (balanceDisplay.style.color = "#c0392b")
    : (balanceDisplay.style.color = "#2e75cc");
};

const render = () => {
  transactionsUl.innerHTML = ""; // reset list
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

render();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
  const transaction = {
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  };

  transactions.push(transaction);
};

const cleanInputs = () => {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

  if (isSomeInputEmpty) {
    alert("Por favor, preencha os campos em branco.");
    inputTransactionName.focus();
    return;
  }

  addToTransactionsArray(transactionName, transactionAmount);
  render();
  updateLocalStorage();
  cleanInputs();
  inputTransactionName.focus();
};

form.addEventListener("submit", handleFormSubmit);
