const itemsSection = document.getElementById("items-section");
const budgetForm = document.getElementById("budget-form");
const budgetDisplay = document.getElementById("budget-display");
const budgetAmount = document.getElementById("budget-amount");
const emptyElem = document.getElementById("nothing");

const itemListBox = document.getElementById("items-list");
const totalPriceElem = document.getElementById("total");
const amountLeftElem = document.getElementById("amount-left");

let usersBudget = 0;
let listOfItems = [];

function loadApp() {
  let amount = localStorage.getItem("budget-amount");
  if (amount) {
    usersBudget = Number(amount);
  }

  let itemsList = localStorage.getItem("items");
  if (itemsList) {
    listOfItems = JSON.parse(itemsList);
  }
}

loadApp();

// List of objects

function updateBudget(amount) {
  if (amount === 0) {
    budgetDisplay.style.display = "none";
    itemsSection.style.display = "none";
  } else {
    budgetAmount.innerText = amount;
    budgetDisplay.style.display = "block";
    itemsSection.style.display = "block";
  }
  usersBudget = amount;
  updateList();
  getTotalCost();

  localStorage.setItem("budget-amount", amount);
}

updateBudget(usersBudget);

budgetForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(e.target.elements.budget.value);
  let value = e.target.elements.budget.value;
  updateBudget(Number(value));
  e.target.elements.budget.value = "";
});

// Get the item list container

function updateList() {
  if (listOfItems.length === 0) {
    emptyElem.style.display = "block";
  } else {
    emptyElem.style.display = "none";
  }
  localStorage.setItem("items", JSON.stringify(listOfItems));

  const displayedItems = listOfItems.map((item) => {
    let listItem = `<li id="item-${item.id}" class="item">
                      <h4>${item.name}</h4>
                      <p class="item-price">N${item.price}</p>
                      <button class="remove-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                        </svg>
                        <span class="sr-only">Delete</span>
                      </button>
                    </li>`;
    return listItem;
  });

  itemListBox.innerHTML = displayedItems.join("");

  listOfItems.forEach((item) => {
    addEvents(item.id);
  });
}

// Get the total cost of items
function getTotalCost() {
  let totalCost = 0;
  listOfItems.forEach((item) => {
    totalCost += item.price;
  });

  let balance = usersBudget - totalCost;
  totalPriceElem.innerText = totalCost;
  amountLeftElem.innerText = balance;
}

// Allow user to add items to the list

const itemForm = document.getElementById("items-form");
let idCount = 0;

itemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let itemName = e.target.elements.itemName.value;
  let price = e.target.elements.amount.value;

  idCount += 1;
  let newItem = {
    id: idCount,
    name: itemName,
    price: Number(price),
  };

  listOfItems.push(newItem);

  updateList();
  getTotalCost();
  e.target.elements.itemName.value = "";
  e.target.elements.amount.value = "";
});

function addEvents(id) {
  let itemElem = document.getElementById(`item-${id}`);

  let targetItem = listOfItems.find((item) => item.id === id);

  let removeButton = itemElem.querySelector(".remove-button");

  removeButton.addEventListener("click", () => {
    listOfItems = listOfItems.filter((item) => item.id !== targetItem.id);
    updateList();
    getTotalCost();
  });
}

// ---------------------- EXTRA --------------------------------------------------------------------
// DARK MODE

let darkModeButton = document.getElementById("dark-mode");
darkModeButton.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
});
