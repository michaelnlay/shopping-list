// 1. Get module ****
const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearBtn = document.getElementById("clear");
const formBtn = itemForm.querySelector("button");

let isEditMode = false;

function displayItems() {
  //Get items from storage
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
  checkUI();
}

//3. Create an addItem function *****
function onAddItemSubmit(e) {
  e.preventDefault(); //to prevent it submits to the file

  const newItem = itemInput.value;

  //4. Validate input *****
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    //take the item that is editing, remove from localStorage
    //then remove from UI from the DOM
    //Then add the new item
    const itemToEdit = itemList.querySelector(".edit-mode");
    // console.log(itemToEdit.textContent);
    removeItemFromStorage(itemToEdit.textContent);
    //remove class
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    //then set isEditMode back false
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("That item is already exists!");
      return;
    }
  }

  //Create item DOM element
  addItemToDOM(newItem);

  //Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = "";
}

function addItemToDOM(item) {
  //5. Create List Item *****
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");

  li.appendChild(button);

  //Add li to the DOM
  itemList.appendChild(li);
}

//Create a CreateButton function
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;

  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);

  return button;
}
//Create an icon
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

//Create a function to add item to localStorage
function addItemToStorage(item) {
  //check if item already in local storage
  // let itemsFromStorage;

  // if (localStorage.getItem("items") === null) {
  //   //items is the key; equal null means nothing in the localStorage
  //   itemsFromStorage = [];
  // } else {
  //   itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  //   //set that to array of item from storage
  //   //use JSON.parse to convert string to array
  // }

  //Simple way by follow the Dont repeat itself, after createing the getItemsFromStroage
  const itemsFromStorage = getItemsFromStorage();

  //Add new item to array
  itemsFromStorage.push(item);

  //Convert to JSON string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

//Get items from storage
function getItemsFromStorage() {
  //check if item already in local storage
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    //items is the key; equal null means nothing in the localStorage
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    //set that to array of item from storage
    //use JSON.parse to convert string to array
  }
  return itemsFromStorage;
}

//onClick item to appear item on the input field
function onClickItem(e) {
  // console.log(e.target.parentElement.parentElement);
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    //create another funciton to set item edit
    setItemToEdit(e.target);
  }
}

//Function to prevent duplicate item
function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  // if (itemsFromStorage.includes(item)) {
  //   return true;
  // } else {
  //   return false;
  // }
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  //1, set isEditMode to true
  isEditMode = true;

  //To prevent all item to be to gray color when click on it, use loop
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  // console.log(formBtn.innerHTML);
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "green";
  itemInput.value = item.textContent;
  // console.log("item is" + item.textContent);
}

//Remove item
// function removeItem(e) {
//   // console.log(e.target.parentElement.classList);
//   //validate that only click and remove with class name of remove-item

//   if (e.target.parentElement.classList.contains("remove-item")) {
//     if (confirm("Are you sure?")) {
//       e.target.parentElement.parentElement.remove(); //from icon->button->list
//       checkUI();
//     }
//     // console.log("click");
//   }
// }
function removeItem(item) {
  if (confirm("Are you sure?")) {
    //Remove item from DOM
    item.remove();

    //remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // console.log(itemsFromStorage);
  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //Re-set to localstorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

//Clear all item
function clearItems() {
  // itemList.remove(); //or you can do
  // itemList.innerHTML = ""; //or you can do
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  //Clear from localStorage
  localStorage.removeItem("items");

  checkUI();
}
//Filter Items
function filterItems(e) {
  //1, get the text that being type, and make it lower case to prevent issue with uppercase on the item list
  const text = e.target.value.toLowerCase();
  console.log(text);
  //3, get the list item
  const items = itemList.querySelectorAll("li");
  //4, loop through items
  //4a, get the name, not the whole element tag this will return a node "Milk", change node to text, then make it lower case
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    //5, match the typed text to the list item text use indexOf, if not true, it returns -1
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
//Check UI to appear or hidden the filter and clear all button
function checkUI() {
  itemInput.value = "";

  const items = itemList.querySelectorAll("li"); //so everytime function runs, we will take on new items

  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
  //change the button back to default color after update item
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

//Create initialize app so we don't have them on the global scope
function init() {
  //2. Even Listeners ******
  itemForm.addEventListener("submit", onAddItemSubmit); // add to DOM and add to localStorage
  // itemList.addEventListener("click", removeItem); //change this to onItemClick so itstead of removing them, have them on the input form after click on the clear button or input field for updating
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems); //for filter item

  //Display items on the page fromm the local Storage when the page is loaded
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();

//To edit the item on the list when user click on the item on the DOM
