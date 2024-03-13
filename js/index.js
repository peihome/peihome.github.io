"use strict";
import {
    getCookieByName,
    deleteCookie,
    getUserDetails
} from "/js/cookieUtil.js";

$(document).ready(() => {
    const userString = getCookieByName('loggedInUser');
    if (!userString) {
        window.location.href = '/html/login.html';
        return;
    }

    //Populate the tasks on page load
    populateTaskList();

    //Load the users list on page load
    populateUsersList();

    //Jquery based click event for handling addition of newer elements in DOM
    $(document).on('click', '.editIcon', function(ele) {
        openTaskEdit(ele);
    });

    //Jquery based click event for handling addition of newer elements in DOM
    $(document).on('click', '.trashIcon', function(ele) {
        deleteTask(ele);
    });

    //Save Task event trigger
    $('#saveTask').click(() => {
        switch ($('#task-category').val()) {
            case 'To-Do':
                addToDO();
                break;
            case 'In-Progress':
                addInProgress();
                break;
            case 'Completed':
                addCompleted();
        }
        $('#b-close').click();
        resetForm();
    });

    //Add Task popup action
    $(".addTask").click((ele) => {
        $("#task-category").val(ele.target.id);
        $("#b-popup").addClass("active");
        $('#b-popup').removeClass('dN');
        $(".backgroundDiv").addClass("blur");
    });

    //Remove cookie on logout action
    $('#logout').click(() => {
        deleteCookie('loggedInUser');
        window.location.href = '/html/login.html';
    });

    //On change event for search bar
    $( "#searchField" ).on( "keyup", function() {
        searchBar();
    } );

    //Popup close event handler
    $("#b-popup #b-close").click(() => {
        $('#b-popup').addClass('dN');
        $("#b-popup").removeClass("active");
        $(".backgroundDiv").removeClass("blur");
        $(".container_new").removeClass("active");
    });
});

function populateUsersList() {
    const userDetails = getUserDetails();

    jQuery.each(userDetails, function(key, val) {
        $('#task-assign').append($('<option>', {
            value: key,
            text: key
        }));
    });
}

const addToDO = () => {
    let todo = {};
    if (window.localStorage.todo) {
        todo = JSON.parse(window.localStorage.todo);
    }

    let taskId = $('#taskId').val();
    if (!taskId) {
        taskId = generateTaskId();
    }
    let currentData = {
        'taskId': taskId,
        'taskName': $('#task-name').val(),
        'taskDescription': $('#task-description').val(),
        'taskAssigned': $('#task-assign').val(),
        'taskDue': $('#task-due').val(),
        'taskCreatedBy': getCookieByName('loggedInUser'),
        'taskCategory': $('#task-category').val()
    };
    todo[taskId] = currentData;

    let isCategoryChange = false;
    let localData = JSON.parse(window.localStorage.inProgress);
    if (localData[taskId]) {
        delete localData[taskId];
        window.localStorage.inProgress = JSON.stringify(localData);
        isCategoryChange = true;
    }

    localData = JSON.parse(window.localStorage.completed);
    if (localData[taskId]) {
        delete localData[taskId];
        window.localStorage.completed = JSON.stringify(localData);
        isCategoryChange = true;
    }

    window.localStorage.todo = JSON.stringify(todo);
    if (isCategoryChange) {
        window.location.reload();
    }
    appendToDoData(taskId, currentData.taskName, currentData.taskDescription, currentData.taskDue, currentData.taskCreatedBy, currentData.taskAssigned);
}

const addInProgress = () => {
    let inProgress = {};
    if (window.localStorage.inProgress) {
        inProgress = JSON.parse(window.localStorage.inProgress);
    }

    let taskElem = $('#taskId');
    let taskId = taskElem.val();
    if (!taskId) {
        taskId = generateTaskId();
        taskElem.val('');
    }
    let currentData = {
        'taskId': taskId,
        'taskName': $('#task-name').val(),
        'taskDescription': $('#task-description').val(),
        'taskAssigned': $('#task-assign').val(),
        'taskDue': $('#task-due').val(),
        'taskCreatedBy': getCookieByName('loggedInUser'),
        'taskCategory': $('#task-category').val()
    };
    inProgress[taskId] = currentData;

    let localData = JSON.parse(window.localStorage.todo);
    let isCategoryChange = false;
    if (localData[taskId]) {
        delete localData[taskId];
        window.localStorage.todo = JSON.stringify(localData);
        isCategoryChange = true;
    }

    localData = JSON.parse(window.localStorage.completed);
    if (localData[taskId]) {
        delete localData[taskId];
        window.localStorage.completed = JSON.stringify(localData);
        isCategoryChange = true;
    }


    window.localStorage.inProgress = JSON.stringify(inProgress);
    if (isCategoryChange) {
        window.location.reload();
    }
    appendInProgressData(taskId, currentData.taskName, currentData.taskDescription, currentData.taskDue, currentData.taskCreatedBy, currentData.taskAssigned);

}

const addCompleted = () => {
    let completed = {};
    if (window.localStorage.completed) {
        completed = JSON.parse(window.localStorage.completed);
    }

    let taskElem = $('#taskId');
    let taskId = taskElem.val();
    if (!taskId) {
        taskId = generateTaskId();
        taskElem.val('');
    }
    let currentData = {
        'taskId': taskId,
        'taskName': $('#task-name').val(),
        'taskDescription': $('#task-description').val(),
        'taskAssigned': $('#task-assign').val(),
        'taskDue': $('#task-due').val(),
        'taskCreatedBy': getCookieByName('loggedInUser'),
        'taskCategory': $('#task-category').val()
    };
    completed[taskId] = currentData;
    let localData = JSON.parse(window.localStorage.todo);
    let isCategoryChange = false;
    if (localData[taskId]) {
        delete localData[taskId];
        window.localStorage.todo = JSON.stringify(localData);
        isCategoryChange = true;
    }

    localData = JSON.parse(window.localStorage.inProgress);
    if (localData[taskId]) {
        delete localData[taskId];
        window.localStorage.inProgress = JSON.stringify(localData);
        isCategoryChange = true;
    }

    window.localStorage.completed = JSON.stringify(completed);
    if (isCategoryChange) {
        window.location.reload();
    }
    appendCompletedData(taskId, currentData.taskName, currentData.taskDescription, currentData.taskDue, currentData.taskCreatedBy, currentData.taskAssigned);
}

const appendToDoData = (taskId, name, description, due, createdBy, assignedTo) => {
    const todoData = `<div class="col orangeBar" id="${taskId}">
                        <div class="boxTask">
                        <img src="./img/edit.png" alt="" class="imgIcon editIcon" id="editIcon" taskId="${taskId}" taskCategory="todo"/>
                        <img src="./img/trash.png" alt="" class="imgIcon trashIcon" id="trashIcon" taskId="${taskId}" taskCategory="todo"/>
                        <p><b>Name : </b>${name}</p>
                        <p></p><b>Description : </b>${description}</p>
                        <p></p><b>Due on : </b>${due}</p>
                        <p></p><b>Created By : </b>${createdBy}</p>
                        <p></p><b>Assigned To : </b>${assignedTo}</p>
                    </div>
                    </div>`;
    let taskIdVal = $('#taskId').val();
    if (taskIdVal) {
        let taskElem = $('#' + taskIdVal);
        taskElem.after(todoData);
        taskElem.remove();
    } else {
        $('#todo').append(todoData);
    }
}


const appendInProgressData = (taskId, name, description, due, createdBy, assignedTo) => {
    const todoData = `<div class="col blueBar" id="${taskId}">
                        <div class="boxProgress">
                        <img src="./img/edit.png" alt="" class="imgIcon editIcon" id="editIcon" taskId="${taskId}" taskCategory="inProgress"/>
                        <img src="./img/trash.png" alt="" class="imgIcon trashIcon" id="trashIcon" taskId="${taskId}" taskCategory="inProgress"/>
                        <p><b>Name : </b>${name}</p>
                        <p></p><b>Description : </b>${description}</p>
                        <p></p><b>Due on : </b>${due}</p>
                        <p></p><b>Created By : </b>${createdBy}</p>
                        <p></p><b>Assigned To : </b>${assignedTo}</p>
                    </div>
                    </div>`;
    let taskIdVal = $('#taskId').val();
    if (taskIdVal) {
        let taskElem = $('#' + taskIdVal);
        taskElem.after(todoData);
        taskElem.remove();
    } else {
        $('#inProgress').append(todoData);
    }
}


const appendCompletedData = (taskId, name, description, due, createdBy, assignedTo) => {
    const todoData = `<div class="col greenBar" id="${taskId}">
                        <div class="boxCompleted">
                        <img src="./img/edit.png" alt="" class="imgIcon editIcon" id="editIcon" taskId="${taskId}" taskCategory="completed"/>
                        <img src="./img/trash.png" alt="" class="imgIcon trashIcon" id="trashIcon" taskId="${taskId}" taskCategory="completed"/>
                        <p><b>Name : </b>${name}</p>
                        <p></p><b>Description : </b>${description}</p>
                        <p></p><b>Due on : </b>${due}</p>
                        <p></p><b>Created By : </b>${createdBy}</p>
                        <p></p><b>Assigned To : </b>${assignedTo}</p>
                    </div>
                    </div>`;
    let taskIdVal = $('#taskId').val();
    if (taskIdVal) {
        let taskElem = $('#' + taskIdVal);
        taskElem.after(todoData);
        taskElem.remove();
    } else {
        $('#completed').append(todoData);
    }
}

const populateTaskList = () => {

    //To-Do Data
    let todo = {};
    if (window.localStorage.todo) {
        todo = JSON.parse(window.localStorage.todo);
    }
    jQuery.each(todo, function(key, currentData) {
        appendToDoData(currentData.taskId, currentData.taskName, currentData.taskDescription, currentData.taskDue, currentData.taskCreatedBy, currentData.taskAssigned);
    });

    //In-Progress Data
    let inProgress = {};
    if (window.localStorage.inProgress) {
        inProgress = JSON.parse(window.localStorage.inProgress);
    }
    jQuery.each(inProgress, function(key, currentData) {
        appendInProgressData(currentData.taskId, currentData.taskName, currentData.taskDescription, currentData.taskDue, currentData.taskCreatedBy, currentData.taskAssigned);
    });

    //Completed Data
    let completed = {};
    if (window.localStorage.completed) {
        completed = JSON.parse(window.localStorage.completed);
    }
    jQuery.each(completed, function(key, currentData) {
        appendCompletedData(currentData.taskId, currentData.taskName, currentData.taskDescription, currentData.taskDue, currentData.taskCreatedBy, currentData.taskAssigned);
    });
}

const generateTaskId = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

const openTaskEdit = (ele) => {

    let element = $(ele.target);
    const taskId = element.attr('taskId');
    $('#taskId').val(taskId);

    let taskData = {};

    switch (element.attr('taskcategory')) {
        case 'todo':
            taskData = JSON.parse(window.localStorage.todo)[taskId];
            setVauesForEditForm(taskData, 'To-Do');
            break;
        case 'inProgress':
            taskData = JSON.parse(window.localStorage.inProgress)[taskId];
            setVauesForEditForm(taskData, 'In-Progress');
            break;
        case 'completed':
            taskData = JSON.parse(window.localStorage.completed)[taskId];
            setVauesForEditForm(taskData, 'Completed');
            break;
    }
    $("#b-popup").addClass("active");
    $('#b-popup').removeClass('dN');
    $(".backgroundDiv").addClass("blur");
}

const setVauesForEditForm = (taskDetails, taskCategory) => {
    $('#task-name').val(taskDetails.taskName);
    $('#task-description').val(taskDetails.taskDescription);
    $('#task-assign').val(taskDetails.taskAssigned);
    $('#task-due').val(taskDetails.taskDue);
    $('#task-category').val(taskCategory);
}

const deleteTask = (ele) => {
    let element = $(ele.target);
    let taskId = element.attr('taskId');
    let taskcategory = element.attr('taskcategory');
    let taskData = {};
    switch (taskcategory) {
        case 'todo':
            taskData = JSON.parse(window.localStorage.todo);
            delete taskData[taskId];
            window.localStorage.todo = JSON.stringify(taskData);
            break;
        case 'inProgress':
            taskData = JSON.parse(window.localStorage.inProgress);
            delete taskData[taskId];
            window.localStorage.inProgress = JSON.stringify(taskData);
            break;
        case 'completed':
            taskData = JSON.parse(window.localStorage.completed);
            delete taskData[taskId];
            window.localStorage.completed = JSON.stringify(taskData);
            break;
    }
    ele.target.parentNode.parentNode.remove();
}

const resetForm = () => {
    $('#task-name').val('');
    $('#task-description').val('');
    $('#task-assign').val('none');
    $('#task-due').val('');
    $('#task-category').val('');
}

const searchBar = () => {
    const searchText = $('#searchField').val();

    //Search in todo
    let todoData = JSON.parse(window.localStorage.todo);
    if (searchText != '') {
        todoData = filter(todoData, searchText);
    }
    $('.orangeBar').remove();
    jQuery.each(todoData, function(key, currentData) {
        appendToDoData(currentData.taskId, currentData.taskName, currentData.taskDescription, currentData.taskDue, currentData.taskCreatedBy, currentData.taskAssigned);
    });

    //Search in InProgress
    let inProgress = JSON.parse(window.localStorage.inProgress);
    if (searchText != '') {
        inProgress = filter(inProgress, searchText);
    }
    $('.blueBar').remove();
    jQuery.each(inProgress, function(key, currentData) {
        appendInProgressData(currentData.taskId, currentData.taskName, currentData.taskDescription, currentData.taskDue, currentData.taskCreatedBy, currentData.taskAssigned);
    });

    //Search in Completed
    let completed = JSON.parse(window.localStorage.completed);
    if (searchText != '') {
        completed = filter(completed, searchText);
    }
    $('.greenBar').remove();
    jQuery.each(completed, function(key, currentData) {
        appendCompletedData(currentData.taskId, currentData.taskName, currentData.taskDescription, currentData.taskDue, currentData.taskCreatedBy, currentData.taskAssigned);
    });

}

const filter = (data, searchText) => {
    let result = {};
    jQuery.each(data, function(key, currentData) {
        if ((currentData.taskId + "").includes(searchText) ||
            currentData.taskName.includes(searchText) ||
            currentData.taskDescription.includes(searchText) ||
            currentData.taskAssigned.includes(searchText) ||
            currentData.taskDue.includes(searchText) ||
            currentData.taskCreatedBy.includes(searchText) ||
            currentData.taskCategory.includes(searchText)
        ) {
            result[key] = currentData;
        }
    });

    return result;
}