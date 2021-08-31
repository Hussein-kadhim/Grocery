// ****** SELECT ITEMS **********
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
leteditID = "";
// ****** FUNCTIONS **********
const addItem = (e) => {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id,value)
    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // add two local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert('value changed', 'success')
    editLocalStorage(editID,value)
    setBackToDefault()
  } else {
    displayAlert("please enter value", "danger");
  }
};

// display alert
const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //  remove alert
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
};
// clear items
const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem('list')
};

// edit function
const editItem = (e) => {
 const element = e.currentTarget.parentElement.parentElement;
//  set edit item
editElement = e.currentTarget.parentElement.previousElementSibling
// set form value
grocery.value = editElement.innerHTML
editFlag = true
editID = element.dataset.id;
 submitBtn.textContent = 'edit'
};

// delete function
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
  }
  if (list.children.length > 0) {
    displayAlert("item removed", "danger");
  }
  setBackToDefault()
//    remove from local storage
removeFromLocalStorage(id)
};

// set back to default
const setBackToDefault = () => {
  grocery.value = ""; // This reset the input and place in the form
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
};

// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);

// clear items
clearBtn.addEventListener("click", clearItems);

// ****** LOCAL STORAGE **********

const addToLocalStorage = (id, value) => {
const grocery = {id,value}
let items = getLocalStorage()
console.log(items)
items.push(grocery)
localStorage.setItem('list',JSON.stringify(items))
};
const removeFromLocalStorage = (id) =>{
    let items = getLocalStorage();

   items = items.filter((item) => {
    if(item.id !==id){
        return item
    }
   })
   localStorage.setItem('list',JSON.stringify(items))
}
const editLocalStorage = (id,value) =>{
let items = getLocalStorage();
items = items.map((item)=>{ 
    if(item.id === id){
        item.value = value
    }
    return item
})
localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[]; 
}

const getLocalStorage = () =>{
   return localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[];
}
// ****** SETUP ITEMS **********

const setupItems = () =>{
    let items = getLocalStorage()
        if(items.length > 0){
items.forEach((item) =>{
createListItem(item.id,item.value)
})
container.classList.add('show-container')
   }
}

const createListItem = (id,value) =>{
    const element = document.createElement("artical");
    // add class
    element.classList.add("grocery-item");
    //  add id
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
           <div class="btn-container">
           <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
            </button> 
            <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
            </button> 
            </div>`;
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");
    // delte button
    deleteBtn.addEventListener("click", deleteItem);
    // edit button
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(element);
}

//  load items 
window.addEventListener('DOMContentLoaded',setupItems)