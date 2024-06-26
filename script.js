const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
// const items = itemList.querySelectorAll('li');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  ResetUI();
}

// we can only store strings in local storage
// event handler
function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Check for edit mode
  // if in edit mode then remove value from localStorage and from DOM
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  ResetUI();

  itemInput.value = '';
}

// add to the DOM
function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}

// add to the localStorage // local Storge can only hold string
function addItemToStorage(item) {
  const itemsFromStorage = getItemFromStorage(); // array of items

  // if (localStorage.getItem('items') === null) {
  //   // nothing in local storage as a key which is 'items'
  //   itemsFromStorage = [];
  // } else {
  //   itemsFromStorage = JSON.parse(localStorage.getItem('items')); // JSON.parse(string) --> gives array of items
  // }

  // Add new item to the array as a key which is 'items'
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage)); // JSON.stringify(array) --> gives string
}

// get item from localStorage // local Storge can only hold string
function getItemFromStorage() {
  let itemsFromStorage; // array of items

  if (localStorage.getItem('items') === null) {
    // nothing in local storage as a key which is 'items'
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items')); // JSON.parse(string) --> gives array of items
  }

  return itemsFromStorage;
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

// handler
// figure out what was clicked on
function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

// check if same item exists
function checkIfItemExists(item) {
  const itemsFromStorage = getItemFromStorage(); // array of items

  return itemsFromStorage.includes(item);

  // if (itemsFromStorage.includes(item)) {
  //   return true;
  // } else {
  //   return false;
  // }
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  // item.style.color = '#ccc';
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  // console.log(item.textContent);
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from localStorage
    removeItemFromStorage(item.textContent);

    ResetUI();
  }
}

// remove item value from local storage
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage(); // fetching items from storage

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item); // new array

  // Reset to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// if (e.target.parentElement.classList.contains('remove-item')) {
//   if (confirm('Are you sure?')) {
//     e.target.parentElement.parentElement.remove();
//     ResetUI();
//   }
// }
// }

function clearItems() {
  // itemList.innerHTML = '';
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from localStorage
  localStorage.removeItem('items');
  ResetUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li'); // return node list

  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) !== -1) {
      // not match
      item.style.display = 'flex';
    } else {
      // match
      item.style.display = 'none';
    }
  });
}

function ResetUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  // when page load, run this
  ResetUI();
}

init();

// localStorage.setItem('name', 'Brad');
// console.log(localStorage.getItem('name'));
// localStorage.removeItem('name');
// localStorage.clear();
