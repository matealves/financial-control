const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const selectMonth = document.querySelector("#month");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const setMonth = () => {
  let getMonth = new Date().getMonth();
  Array.from(selectMonth.children).forEach((option) => {
    option.removeAttribute("selected");
  });
  selectMonth[getMonth].setAttribute("selected", "");
};

setMonth();

const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  render();
};
const editTransaction = (id) => {
  let currentTransaction = transactions.filter(
    (transaction) => transaction.id == id
  );

  inputTransactionName.value = currentTransaction[0].name;
  inputTransactionAmount.value = currentTransaction[0].amount;
  document.querySelector(".btn").textContent = "Salvar";
  inputTransactionName.focus();

  let elemento = document.querySelector(`[onclick="editTransaction(${id})"]`);
  elemento.setAttribute("data-edited", id);
  elemento.parentElement.style.background = "#d1d1d1";
};

const addTransactionIntoDOM = ({ id, name, amount }) => {
  const operator = amount < 0 ? "-" : "+";
  const CSSClas = amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(amount).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  const li = document.createElement("li");

  li.classList.add(CSSClas);
  li.innerHTML = `${name} <span>${operator}
  ${amountWithoutOperator}</span>
  <button class="edit-btn" onClick="editTransaction(${id})" title="Editar"><box-icon type='solid' name='edit'></box-icon></i></button>
  <button class="delete-btn" onClick="removeTransaction(${id})" title="Apagar"><box-icon class="trash" type='solid' name='trash'></box-icon></button>`;

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
  const transactionsAmount = transactions
    .filter(({ month }) => month == selectMonth.value)
    .map(({ amount }) => amount);
  let total = getTotal(transactionsAmount);
  const income = getIncomes(transactionsAmount);
  const expense = getExpenses(transactionsAmount);

  if (total < 0 && total > -1) {
    total = Math.abs(total.toFixed(2));
  }

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
    : (balanceDisplay.style.color = "#9c88ff");
};

const render = () => {
  transactionsUl.innerHTML = ""; // reset list
  transactions
    .filter(({ month }) => month == selectMonth.value)
    .forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

render();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (month, name, amount) => {
  const hasEdited = document.querySelector("[data-edited]");

  if (hasEdited) {
    let id = hasEdited.getAttribute("data-edited");

    transactions.forEach((transaction) => {
      if (transaction.id == id) {
        transaction.name = name;
        transaction.amount = Number(amount);
      }
    });

    hasEdited.removeAttribute("data-edited");
    document.querySelector(".btn").textContent = "Adicionar";

    return;
  }

  const transaction = {
    id: generateID(),
    month: Number(month),
    name: name,
    amount: Number(amount),
  };

  transactions.push(transaction);
};

const cleanInputs = () => {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionMonth = selectMonth.value;
  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

  if (isSomeInputEmpty) {
    alert("Por favor, preencha os campos em branco.");
    inputTransactionName.focus();
    return;
  }

  addToTransactionsArray(transactionMonth, transactionName, transactionAmount);
  render();
  updateLocalStorage();
  cleanInputs();
  inputTransactionName.focus();
};

selectMonth.addEventListener("input", render);

form.addEventListener("submit", handleFormSubmit);
