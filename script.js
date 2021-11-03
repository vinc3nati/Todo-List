const form = document.querySelector("#new-todo-form");
const list = document.querySelector("#list");
const template = document.querySelector("#list-item-template");
const todoInput = document.querySelector("#todo-input");
const LOCAL_STORAGE_PREFIX = "PERSONAL_TODO";
const TODO_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodo();

// rendering our stored todos
todos.forEach((todo) => {
  renderTodo(todo);
});

// Add Toddo
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoName = todoInput.value;
  if (todoName === "") return;
  const newTodo = {
    name: todoName,
    isComplete: false,
    id: new Date().valueOf().toString(),
    borderColor: "#e9a6a6",
  };
  todos.push(newTodo);
  renderTodo(newTodo);
  saveTodo();
  todoInput.value = "";
});

// saving the checked state of individual todos
list.addEventListener("change", (e) => {
  if (!e.target.matches("[data-list-item-checkbox]")) return;

  const parent = e.target.closest(".list-item");
  const todoId = parent.dataset.todoId;

  const clickedTodo = todos.find((todo) => todo.id === todoId);
  clickedTodo.isComplete = e.target.checked;
  if (e.target.checked) {
    parent.style.borderLeft = "6px solid #00A19D";
    clickedTodo.borderColor = "#00A19D";
  } else {
    parent.style.borderLeft = "6px solid #e9a6a6";
    clickedTodo.borderColor = "#e9a6a6";
  }
  saveTodo();
});

list.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-delete]")) return;
  const parent = e.target.closest(".list-item");
  // remove from screen
  parent.remove();
  // remove from todo array
  const todoId = parent.dataset.todoId;
  todos = todos.filter((todo) => todo.id !== todoId);
  // update changes in localStorage
  saveTodo();
});

// Display Todo
function renderTodo(todo) {
  const templateClone = template.content.cloneNode(true);
  const listItem = templateClone.querySelector(".list-item");
  listItem.dataset.todoId = todo.id;
  const todoText = listItem.querySelector("[data-list-item-text]");
  todoText.innerText = todo.name;
  const checkbox = templateClone.querySelector("[data-list-item-checkbox]");
  checkbox.checked = todo.isComplete;
  listItem.style.borderLeft = `6px solid ${todo.borderColor}`;
  list.appendChild(templateClone);
}

// Save Todo
function saveTodo() {
  // as local storage accepts string values we convert our js object i.e array to string via stringify()
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

// Load Todos
function loadTodo() {
  // we return todos by converting them to proper array format
  const todo = localStorage.getItem(TODO_STORAGE_KEY);
  return JSON.parse(todo) || [];
}
