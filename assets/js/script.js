var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgress = document.querySelector("#tasks-in-progress");
var tasksCompleted = document.querySelector("#tasks-completed");

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name'").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if inputs are empty (validate)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
  }
  
  formEl.reset();

  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  //checking if form has data-task-id attribute
  var isEdit = formEl.hasAttribute("data-task-id");


  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  };
//if the task has a data-task-id, get task id and finish edit process
  if (isEdit) {
      var taskId = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
//if the task does not have a data-task-id, use normal object and pass to create task El function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };
    createTaskEl(taskDataObj);
    }  
};

var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  //Add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);


  //storing task actions in variable
  var taskActionsEl = createTaskActions(taskIdCounter);
  //adding actions to list items
  listItemEl.appendChild(taskActionsEl)

  // add list item to list
  tasksToDoEl.appendChild(listItemEl);

  //increase task counter for next unique id
  taskIdCounter++;
};

var completeEditTask = function(taskName, taskType, taskId) {
    //selecting matching list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //setting new values for selected task by changing content
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContnet = taskType;

    //update message
    alert("Task updated!");

    //reset form
    document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-Id", taskId);

    //append edit button to div (action container)
    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    //append delete button to div
    actionContainerEl.appendChild(deleteButtonEl);

    //Create internal dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    //generating options
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i <statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
    statusSelectEl.appendChild(statusOptionEl);
    }

    //append internal dropdown to action container
    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

//creating task button handler
var taskButtonHandler = function(event) {
    //get target element from event
    var targetEl = event.target;

    //edit button click
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    //delete button click
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
  };

//new editing function
var editTask = function(taskId) {
    console.log("editing task #" + taskId);

    //get list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId +"']");

    //get content from list item
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    //getting value for selected elements and storing to proper variable
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    //changing submit button to "save task"
    document.querySelector("#save-task").textContent = "Save Task";

    //will add taskId to attribute on the form
    formEl.setAttribute("data-task-id", taskId);
};
//delete task function
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};
//task status change handler function
//event target references select element in list item
var taskStatusChangeHandler = function(event) {
    //get task item id
    var taskId = event.target.getAttribute("data-task-id");

    //get current selected option value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find parent list item based on id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //moving task based on option selected in dropdown
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgress.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompleted.appendChild(taskSelected);
    }
};
//new task and form submit
formEl.addEventListener("submit", taskFormHandler);
//listen for edit and delete event
pageContentEl.addEventListener("click", taskButtonHandler);
//listen for change event
pageContentEl.addEventListener("change", taskStatusChangeHandler);