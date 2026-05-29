// script.js

const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

// Add Task
addBtn.addEventListener("click", () => {
const taskText = taskInput.value.trim();

if(taskText === "") return;

const task = {
id: Date.now(),
text: taskText,
completed: false
};

tasks.push(task);

saveTasks();
renderTasks();

taskInput.value = "";
});

// Render Tasks
function renderTasks(filter = "all") {

taskList.innerHTML = "";

let filteredTasks = tasks;

if(filter === "active"){
filteredTasks = tasks.filter(task => !task.completed);
}

if(filter === "completed"){
filteredTasks = tasks.filter(task => task.completed);
}

filteredTasks.forEach(task => {

const li = document.createElement("li");
li.classList.add("task");

if(task.completed){
li.classList.add("completed");
}

li.innerHTML = `
<span>${task.text}</span>

<div class="task-buttons">
<button class="complete-btn">
${task.completed ? "Undo" : "Done"}
</button>

<button class="delete-btn">
Delete
</button>
</div>
`;

// Complete Task
li.querySelector(".complete-btn").addEventListener("click", () => {

task.completed = !task.completed;

saveTasks();
renderTasks(getCurrentFilter());
});

// Delete Task
li.querySelector(".delete-btn").addEventListener("click", () => {

tasks = tasks.filter(t => t.id !== task.id);

saveTasks();
renderTasks(getCurrentFilter());
});

taskList.appendChild(li);

});
}

// Save to Local Storage
function saveTasks(){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter Tasks
filterButtons.forEach(button => {

button.addEventListener("click", () => {

filterButtons.forEach(btn => btn.classList.remove("active"));

button.classList.add("active");

const filter = button.dataset.filter;

renderTasks(filter);
});

});

// Get Current Filter
function getCurrentFilter(){

const activeButton = document.querySelector(".filter-btn.active");

return activeButton.dataset.filter;
}