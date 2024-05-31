let taskIdCounter = 0;

function addNewTask() {
    taskIdCounter++;
    const taskId = `task-${taskIdCounter}`;
    const taskItem = `
        <div id="${taskId}" class="task-item" draggable="true" ondragstart="drag(event)">
            <div class="task-title" onclick="toggleDescription(this)">
                <input type="text" value="Tarefa ${taskIdCounter}" oninput="saveTasks()"/>
            </div>
            <div class="task-description">
                <textarea placeholder="Adicione sua atividade aqui!" oninput="saveTasks()" style="width: 321px; height: 96px;"></textarea>
                <button class="btn-delete" onclick="deleteTask('${taskId}')">Excluir</button>
            </div>
        </div>
    `;
    $("#task-list").append(taskItem);
    saveTasks();
}

function toggleDescription(element) {
    const taskItem = $(element).closest('.task-item');
    taskItem.toggleClass('expanded');
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    if (ev.target.classList.contains("coluna1") || ev.target.classList.contains("para-fazer")) {
        $("#task-list").append(draggedElement);
    } else if (ev.target.classList.contains("coluna2") || ev.target.classList.contains("fazendo")) {
        $("#doing-list").append(draggedElement);
    } else if (ev.target.classList.contains("coluna3") || ev.target.classList.contains("feito")) {
        $("#done-list").append(draggedElement);
    } else if (ev.target.classList.contains("task-item")) {
        ev.target.parentNode.appendChild(draggedElement);
    }

    saveTasks();
}

function saveTasks() {
    const toDo = [];
    $("#task-list .task-item").each(function() {
        toDo.push({
            id: this.id,
            title: $(this).find(".task-title input").val(),
            description: $(this).find(".task-description textarea").val()
        });
    });

    const doing = [];
    $("#doing-list .task-item").each(function() {
        doing.push({
            id: this.id,
            title: $(this).find(".task-title input").val(),
            description: $(this).find(".task-description textarea").val()
        });
    });

    const done = [];
    $("#done-list .task-item").each(function() {
        done.push({
            id: this.id,
            title: $(this).find(".task-title input").val(),
            description: $(this).find(".task-description textarea").val()
        });
    });

    localStorage.setItem("toDoTasks", JSON.stringify(toDo));
    localStorage.setItem("doingTasks", JSON.stringify(doing));
    localStorage.setItem("doneTasks", JSON.stringify(done));
}

function loadTasks() {
    const toDo = JSON.parse(localStorage.getItem("toDoTasks")) || [];
    const doing = JSON.parse(localStorage.getItem("doingTasks")) || [];
    const done = JSON.parse(localStorage.getItem("doneTasks")) || [];

    toDo.forEach(task => {
        $("#task-list").append(createTaskElement(task));
    });

    doing.forEach(task => {
        $("#doing-list").append(createTaskElement(task));
    });

    done.forEach(task => {
        $("#done-list").append(createTaskElement(task));
    });
}

function createTaskElement(task) {
    return `
        <div id="${task.id}" class="task-item" draggable="true" ondragstart="drag(event)">
            <div class="task-title" onclick="toggleDescription(this)">
                <input type="text" value="${task.title}" oninput="saveTasks()"/>
            </div>
            <div class="task-description">
                <textarea oninput="saveTasks()" style="width: 321px; height: 96px;">${task.description}</textarea>
                <button class="btn-delete" onclick="deleteTask('${task.id}')">Excluir</button>
            </div>
        </div>
    `;
}

function deleteTask(taskId) {
    $(`#${taskId}`).remove();
    saveTasks();
}

$(document).ready(function() {
    loadTasks();
});
