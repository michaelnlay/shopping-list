// 1. Get module ****
const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearBtn = document.getElementById("clear");

// console.log(items.length);

// console.log(itemForm);

//3. Create an addItem function *****
function addItem(e) {
  e.preventDefault(); //to prevent it submits to the file

  const newItem = itemInput.value;
  //4. Validate input *****
  if (newItem === "") {
    alert("Please add an item");
    return;
  }
  //   console.log(newItem.value);

  //5. Create List Item *****
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));

  const button = createButton("remove-item btn-link text-red");
  //   console.log(li);
  li.appendChild(button);

  //Add li to the DOM
  itemList.appendChild(li);
  checkUI();
  itemInput.value = "";
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

//Remove item
function removeItem(e) {
  // console.log(e.target.parentElement.classList);
  //validate that only click and remove with class name of remove-item

  if (e.target.parentElement.classList.contains("remove-item")) {
    if (confirm("Are you sure?")) {
      e.target.parentElement.parentElement.remove(); //from icon->button->list
      checkUI();
    }
    // console.log("click");
  }
}

//Clear all item
function clearItems() {
  // itemList.remove(); //or you can do
  // itemList.innerHTML = ""; //or you can do
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  checkUI();
}
//Filter Items
function filterItems(e) {
  const filterText = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");
  items.forEach((item) => {
    const itemName = item.firstChild; //li has both text and button so by using firstChild, it will target the first child, which is the text name
    console.log(itemName.textContent.toLowerCase()); //use textContent to convert string to text
  });
}
//Check UI to appear or hidden the filter and clear all button
function checkUI() {
  const items = itemList.querySelectorAll("li"); //so everytime function runs, we will take on new items

  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
}

//2. Even Listeners ******
itemForm.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem);
clearBtn.addEventListener("click", clearItems);
itemFilter.addEventListener("input", filterItems); //for filter item

checkUI();
