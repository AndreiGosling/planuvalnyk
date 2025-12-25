// Отримання елементів
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addTask");
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");

// Завантаження завдань з LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Збереження
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Рендер списку
function renderTasks() {
    taskList.innerHTML = "";

    const search = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    tasks
        .filter(t =>
            t.title.toLowerCase().includes(search) &&
            (status === "all" ||
                (status === "completed" && t.completed) ||
                (status === "active" && !t.completed))
        )
        .forEach((task, index) => {
            const li = document.createElement("li");
            li.className = "task" + (task.completed ? " completed" : "");
            li.dataset.priority = task.priority;

            li.innerHTML = `
                <span>
                    <strong>${task.title}</strong><br>
                    📅 ${task.deadline || "без дедлайну"} |
                    🏷 ${task.category || "без категорії"} |
                    ⚡ ${task.priority}
                </span>
                <div>
                    <button onclick="toggleTask(${index})">✔</button>
                    <button onclick="deleteTask(${index})">🗑</button>
                </div>
            `;
            taskList.appendChild(li);
        });
}

// Додавання
addBtn.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    if (!title) return;

    tasks.push({
        title,
        deadline: document.getElementById("deadline").value,
        priority: document.getElementById("priority").value,
        category: document.getElementById("category").value,
        completed: false
    });

    saveTasks();
    renderTasks();
    document.querySelector(".task-form").reset?.();
});

// Перемикання статусу
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Видалення
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Пошук і фільтр
searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);

// Тема
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Початковий рендер
renderTasks();