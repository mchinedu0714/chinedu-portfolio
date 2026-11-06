const taskForm = document.querySelector('#task-form');
const taskTitle = document.querySelector('#task-title');
const taskDate = document.querySelector('#task-date');
const taskList = document.querySelector('#task-list');
const taskTotal = document.querySelector('#task-total');
const remainingCount = document.querySelector('#remaining-count');
const plannerMessage = document.querySelector('#planner-message');
const clearCompletedButton = document.querySelector('#clear-completed');
const STORAGE_KEY = 'chinedu-academic-docket-v1';
let tasks = [];
let storageAvailable = true;

// Load saved tasks when the planner opens.
try {
  const savedTasks = localStorage.getItem(STORAGE_KEY);
  tasks = savedTasks ? JSON.parse(savedTasks) : [];
  if (!Array.isArray(tasks)) tasks = [];
} catch (error) {
  storageAvailable = false;
  tasks = [];
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    storageAvailable = true;
    plannerMessage.textContent = 'Your tasks are saved in this browser.';
  } catch (error) {
    storageAvailable = false;
    plannerMessage.textContent = 'Browser storage is unavailable. Tasks may not remain after you leave this page.';
  }
}

function formatDueDate(dateValue) {
  if (!dateValue) return 'No due date set';
  const date = new Date(`${dateValue}T00:00:00`);
  return `Due ${date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function renderTasks() {
  taskList.replaceChildren();
  const pending = tasks.filter((task) => !task.completed).length;
  remainingCount.textContent = pending;
  taskTotal.textContent = `${tasks.length} ${tasks.length === 1 ? 'entry' : 'entries'}`;

  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No tasks on this sheet yet. Add your first task above.';
    taskList.append(empty);
    return;
  }

  tasks.forEach((task) => {
    const row = document.createElement('li');
    row.className = `task-row${task.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.title} as ${task.completed ? 'not completed' : 'completed'}`);
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const details = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = task.title;
    const due = document.createElement('small');
    due.textContent = formatDueDate(task.due);
    details.append(title, due);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-task';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${task.title}`);
    remove.addEventListener('click', () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    row.append(checkbox, details, remove);
    taskList.append(row);
  });
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = taskTitle.value.trim();
  if (!title) {
    taskTitle.setCustomValidity('Enter a task description.');
    taskTitle.reportValidity();
    return;
  }
  taskTitle.setCustomValidity('');
  tasks.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, title, due: taskDate.value, completed: false });
  saveTasks();
  renderTasks();
  taskForm.reset();
  taskTitle.focus();
});

taskTitle.addEventListener('input', () => taskTitle.setCustomValidity(''));
clearCompletedButton.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

if (!storageAvailable) plannerMessage.textContent = 'Saved tasks could not be read. New tasks may not persist in this browser.';
renderTasks();
