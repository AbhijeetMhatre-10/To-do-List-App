let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

// Function to retrieve the todo list from localStorage
function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    let result;
    if (parsedTodoList === null) { // If no todo list is found, initialize an empty array
        result = [];
    } else {
        result = parsedTodoList;
    }
    return result;
}

// Load the todo list from localStorage and initialize the todo count
let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

// Event listener for the Save button to persist the todo list to localStorage
saveTodoButton.onclick = function() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
};

// Function to handle adding a new todo
function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue.trim() === "") {
        alert("Enter a To-do");
        return;
    }

    todosCount += 1;
    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";
}

// Event listener for the Add Todo button
addTodoButton.onclick = function() {
    onAddTodo();
};

// Function to handle editing an existing todo
function onEditTodo(todoId, labelId) {
    let labelElement = document.getElementById(labelId);
    let newTaskText = prompt("Edit your task:", labelElement.textContent);
    if (newTaskText && newTaskText.trim() !== "") {
        labelElement.textContent = newTaskText;
        let todoIndex = todoList.findIndex((todo) => "todo" + todo.uniqueNo === todoId); // Find the todo in the list
        if (todoIndex > -1) { // If todo is found
            todoList[todoIndex].text = newTaskText; // Update the todo text in the list
        }
    }
}

// Function to handle deleting a todo
function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    let deleteIndex = todoList.findIndex((todo) => "todo" + todo.uniqueNo === todoId); // Find the todo in the list
    todoList.splice(deleteIndex, 1); // Remove the todo from the list
}

// Function to create and append a todo item to the DOM
function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo; // Create a unique ID for the todo
    let checkboxId = "checkbox" + todo.uniqueNo; // Create a unique ID for the checkbox
    let labelId = "label" + todo.uniqueNo; // Create a unique ID for the label

    let todoElement = document.createElement("li"); // Create a new list item for the todo
    todoElement.classList.add("todo-item-container");
    todoElement.id = todoId;

    // Create a checkbox input for marking the todo as done or not
    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked; // Set the checkbox state based on whether the todo is checked
    inputElement.onclick = function() {
        document.getElementById(labelId).classList.toggle("checked"); // Toggle the 'checked' class on the label
        let todoIndex = todoList.findIndex((eachTodo) => "todo" + eachTodo.uniqueNo === todoId); // Find the todo in the list
        todoList[todoIndex].isChecked = !todoList[todoIndex].isChecked; // Update the todo's checked status
    };

    // Create a label for the todo text
    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId); // Link the label to the checkbox
    labelElement.id = labelId;
    labelElement.textContent = todo.text;
    if (todo.isChecked) {
        labelElement.classList.add("checked");
    }

    // Create a delete icon with a click handler
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash", "delete-icon"); // Add icon classes
    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };

    // Create an edit icon with a click handler
    let editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pen", "edit-icon");
    editIcon.onclick = function() {
        onEditTodo(todoId, labelId);
    };

    // Append the input, label, edit icon, and delete icon to the todo element
    todoElement.append(inputElement, labelElement, editIcon, deleteIcon);

    // Append the todo element to the list container
    todoItemsContainer.appendChild(todoElement);
}

// Loop through the existing todo list and render each todo item
for (let todo of todoList) {
    createAndAppendTodo(todo);
}