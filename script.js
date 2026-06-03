
const taskInput = document.querySelector("#taskInput");
const taskPriority = document.querySelector("#taskPriority");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  const priorityValue = taskPriority.value;

  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
    priority: priorityValue
  };

  tasks.push(task);
  saveTasks();
  renderTasks(getCurrentFilter());

  taskInput.value = "";
  taskPriority.value = "low";
}


function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (filter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add("task");

    if (task.completed) {
      li.classList.add("completed");
    }

    if (task.priority === "high") {
      li.classList.add("priority-high");
    } else if (task.priority === "medium") {
      li.classList.add("priority-medium");
    } else if (task.priority === "low") {
      li.classList.add("priority-low");
    }

    li.innerHTML = `
      <div class="task-content">
        <span class="task-text">${task.text}</span>
        <span class="task-priority">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
      </div>
      <div class="task-buttons">
        <button class="complete-btn">
          ${task.completed ? "Undo" : "Done"}
        </button>
        <button class="delete-btn">
          Delete
        </button>
      </div>
    `;

    li.querySelector(".complete-btn").addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks(getCurrentFilter());
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks(getCurrentFilter());
    });

    taskList.appendChild(li);
  });
}


function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    renderTasks(filter);
  });
});


function getCurrentFilter(){
  const activeButton = document.querySelector(".filter-btn.active");
  return activeButton.dataset.filter;
}