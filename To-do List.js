let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let userInputElement = document.getElementById("todoUserInput");

// Function to retrieve the todo list from localStorage
function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    let result;
    if (parsedTodoList === null) {
        result = [];
    } else {
        result = parsedTodoList;
    }
    return result;
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

// Save the todo list to localStorage
saveTodoButton.onclick = function() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
};

// Create empty message element
let emptyMessage = document.createElement("p");
emptyMessage.textContent = "No tasks available";
emptyMessage.style.textAlign = "center";
emptyMessage.style.color = "#6c757d";
emptyMessage.style.marginTop = "20px";
emptyMessage.style.fontFamily = "Roboto";
emptyMessage.style.fontSize = "18px";
emptyMessage.id = "emptyMessage";

// Function to show or hide empty message
function toggleEmptyMessage() {
    if (todoList.length === 0) {
        todoItemsContainer.appendChild(emptyMessage);
    } else {
        let existingMessage = document.getElementById("emptyMessage");
        if (existingMessage) {
            todoItemsContainer.removeChild(existingMessage);
        }
    }
}

// Add new todo
function onAddTodo() {
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
    toggleEmptyMessage();
}

addTodoButton.onclick = function() {
    onAddTodo();
};

// Pressing Enter key also adds a task
userInputElement.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        onAddTodo();
    }
});

// Edit todo
function onEditTodo(todoId, labelId) {
    let labelElement = document.getElementById(labelId);
    let newTaskText = prompt("Edit your task:", labelElement.textContent);
    if (newTaskText && newTaskText.trim() !== "") {
        labelElement.textContent = newTaskText;
        let todoIndex = todoList.findIndex((todo) => "todo" + todo.uniqueNo === todoId);
        if (todoIndex > -1) {
            todoList[todoIndex].text = newTaskText;
        }
    }
}

// Delete todo
function onDeleteTodo(todoId) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    let deleteIndex = todoList.findIndex((todo) => "todo" + todo.uniqueNo === todoId);
    todoList.splice(deleteIndex, 1);
    toggleEmptyMessage();
}

// Create and append todo
function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container");
    todoElement.id = todoId;

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;
    inputElement.classList.add("checkbox-input");
    inputElement.onclick = function() {
        document.getElementById(labelId).classList.toggle("checked");
        let todoIndex = todoList.findIndex((eachTodo) => "todo" + eachTodo.uniqueNo === todoId);
        todoList[todoIndex].isChecked = !todoList[todoIndex].isChecked;
    };

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.textContent = todo.text;
    if (todo.isChecked) {
        labelElement.classList.add("checked");
    }

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash", "delete-icon");
    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };

    let editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pen", "edit-icon");
    editIcon.onclick = function() {
        onEditTodo(todoId, labelId);
    };

    todoElement.append(inputElement, labelElement, editIcon, deleteIcon);
    todoItemsContainer.appendChild(todoElement);
}

// Render saved todos
for (let todo of todoList) {
    createAndAppendTodo(todo);
}
toggleEmptyMessage();
