class List {
  constructor(inputId, boxSelector) {
    this.input = document.getElementById(inputId);
    this.box = document.querySelector(boxSelector);
    this.items = [];
  }

  add() {
    const text = this.input.value.trim();
    if (text === "") return;

    this.items.push(text);
    this.saveItems();
    this.render();
    this.input.value = "";
  }

  moveTo(targetList, index) {
    const [task] = this.items.splice(index, 1);
    targetList.items.push(task);              
    this.saveItems();
    targetList.saveItems();
    this.render();
    targetList.render();
  } 
}

class TaskList extends List {
  constructor(inputId, boxSelector, editTask) {
    super(inputId, boxSelector);
    this.editTask = editTask;
    this.noTasksMessage = this.box.querySelector("#noTasksMessage");
    this.items = JSON.parse(localStorage.getItem("tasks")) || [];
  }

  saveItems() {
    localStorage.setItem("tasks", JSON.stringify(this.items));
  }

  render() {
    this.box.innerHTML = "<h2>Queue</h2>";

    if (this.items.length === 0) {
      this.box.appendChild(this.noTasksMessage);
      this.noTasksMessage.style.display = "block";
    } else {
      this.noTasksMessage.style.display = "none";
      this.items.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        const taskText = document.createElement("p");
        taskText.textContent = task;
        taskText.onclick = () => this.editTask.showEditTask(index, "tasks"); 

        const doneBtn = document.createElement("button");
        doneBtn.className = "done-btn";
        doneBtn.textContent = "✔";
        doneBtn.onclick = () => this.moveTo(inProgressList, index);

        taskItem.appendChild(taskText);
        taskItem.appendChild(doneBtn);
        this.box.appendChild(taskItem);
      });
    }
  }
}

class InProgressList extends List {
  constructor(boxSelector, editTask) {
    super(null, boxSelector);
    this.editTask = editTask;
    this.noTasksMessage = this.box.querySelector("#noTasksMessage");
    this.items = JSON.parse(localStorage.getItem("inProgressTasks")) || [];
  }

  saveItems() {
    localStorage.setItem("inProgressTasks", JSON.stringify(this.items));
  }

  render() {
    this.box.innerHTML = "<h2>Clock's Ticking</h2>";
  
    if (this.items.length === 0) {
      this.box.appendChild(this.noTasksMessage);
      this.noTasksMessage.style.display = "block";
    } else {
      this.noTasksMessage.style.display = "none";
      this.items.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item in-progress";
  
        const taskText = document.createElement("p");
        taskText.textContent = task;
        taskText.onclick = () => this.editTask.showEditTask(index, "inProgressTasks");
  
        const completeBtn = document.createElement("button");
        completeBtn.className = "done-btn";
        completeBtn.textContent = "✔";
        completeBtn.onclick = () => this.moveTo(completedList, index);
  
        taskItem.appendChild(taskText);
        taskItem.appendChild(completeBtn);
        this.box.appendChild(taskItem);
      });
    }
  }  
}

class CompletedList extends List {
  constructor(boxSelector, editTask) {
    super(null, boxSelector);
    this.editTask = editTask;
    this.noTasksMessage = this.box.querySelector("#noTasksMessage");
    this.items = JSON.parse(localStorage.getItem("completedTasks")) || [];
  }

  saveItems() {
    localStorage.setItem("completedTasks", JSON.stringify(this.items));
  }

  render() {
    this.box.innerHTML = "<h2>Checkmate</h2>";

    if (this.items.length === 0) {
      this.box.appendChild(this.noTasksMessage);
      this.noTasksMessage.style.display = "block";
    } else {
      this.noTasksMessage.style.display = "none";
      this.items.forEach((task) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item completed";

        const taskText = document.createElement("p");
        taskText.textContent = task;
        taskText.onclick = () => completedTaskPopup.show(task);

        taskItem.appendChild(taskText);
        this.box.appendChild(taskItem);
      });
    }
  }
}

class EditTask {
  constructor(sidebarId, closeBtnId) {
    this.sidebar = document.getElementById(sidebarId);
    this.closeBtn = document.getElementById(closeBtnId);
    this.closeBtn.addEventListener("click", () => this.closeEditTask());
  }

  showEditTask(taskIndex, listName) {
    this.taskIndex = taskIndex;
    this.listName = listName;
    const task = JSON.parse(localStorage.getItem(this.listName))[taskIndex];
    const inputField = document.getElementById("editTaskInput");
    inputField.value = task;
    this.sidebar.style.display = "block";
  }

  closeEditTask() {
    this.sidebar.style.display = "none";
  }
}

class TaskEditTask extends EditTask {
  constructor(sidebarId, inputId, saveBtnId, deleteBtnId, closeBtnId) {
    super(sidebarId, closeBtnId);
    this.input = document.getElementById(inputId);
    this.saveBtn = document.getElementById(saveBtnId);
    this.deleteBtn = document.getElementById(deleteBtnId);

    this.saveBtn.addEventListener("click", () => this.saveTask());
    this.deleteBtn.addEventListener("click", () => this.deleteTask());
  }

  saveTask() {
    const newText = this.input.value.trim();
    const list = this.listName === "tasks" ? taskList : inProgressList;
    list.items[this.taskIndex] = newText;
    list.saveItems();
    this.closeEditTask();
    list.render();
  }

  deleteTask() {
    const list = this.listName === "tasks" ? taskList : inProgressList;
    list.items.splice(this.taskIndex, 1);
    list.saveItems();
    this.closeEditTask();
    list.render();
  }
}

class CompletedTaskPopup {
  constructor(completeId, inputId, doneBtnId, closeBtnId, wonPopupId) {
    this.sidebar = document.getElementById(completeId);
    this.input = document.getElementById(inputId);
    this.doneBtn = document.getElementById(doneBtnId);
    this.closeBtn = document.getElementById(closeBtnId);
    this.wonPopup = document.getElementById(wonPopupId);
    this.selectedTaskIndex = null;

    this.doneBtn.addEventListener("click", () => this.showWonPopup());
    this.closeBtn.addEventListener("click", () => this.closePopup());

    document.getElementById("closeWonBtn").addEventListener("click", () => {
      this.removeCompletedTask();
      this.wonPopup.style.display = "none";
    });
  }

  show(taskText, index) {
    this.input.value = taskText;
    this.selectedTaskIndex = index;
    this.sidebar.style.display = "block";
  }

  showWonPopup() {
    this.sidebar.style.display = "none";
    this.wonPopup.style.display = "block";
  }

  closePopup() {
    this.sidebar.style.display = "none";
  }

  removeCompletedTask() {
    if (this.selectedTaskIndex !== null) {
      completedList.items.splice(this.selectedTaskIndex, 1);
      completedList.saveItems();
      completedList.render();
      this.selectedTaskIndex = null;
    }
  }
}

const editbar = new TaskEditTask("taskSidebar", "editTaskInput", "saveEditBtn", "deleteTaskBtn", "closeSidebarBtn");
const completedTaskPopup = new CompletedTaskPopup("completedTasks", "completedTaskInput", "doneBtn", "closeCompletedBtn", "wonPopup");
const taskList = new TaskList("dito", "#taskbox", editbar);
const inProgressList = new InProgressList("#inProgressBox", editbar);
const completedList = new CompletedList("#completedBox", editbar);

document.getElementById("addTask").onclick = () => taskList.add();

function showReminder() {
  const banner = document.getElementById("reminderBanner");
  if (banner) {
    banner.style.display = "block";
  }
}

function dismissReminder() {
  const banner = document.getElementById("reminderBanner");
  if (banner) {
    banner.style.display = "none";
  }
}

window.onload = () => {
  showReminder();
  taskList.render();
  inProgressList.render();
   completedList.render();
  const user = JSON.parse(localStorage.getItem("checkmateProfile"));
  if (user && user.nickname) {
    document.getElementById("welcomeMessage").textContent = `Welcome, ${user.nickname}!`;
  }
};
