import { createTodoApp } from './view.js';
import { createTodoAppLocal } from './todo-app.js';
import {  getTodoList, createTodoItem, switchTodoItemDone, deleteTodoItem } from './api.js';

//нашел кнопку смены хранилища
let btnStorage = document.getElementById('btnStorage');

//отрисовываю приложение из локальной памяти
createTodoAppLocal(document.getElementById('todo-app'), title, keyName);

function restoreButtonState() {
  const isPressed = localStorage.getItem("buttonState");
  if (isPressed === "true") {
    btnStorage.classList.add("pressed");

    //нашел заголовок, форму, список дел
    let titleLocal = document.querySelector('.title-local');
    let formLocal = document.querySelector('.form-local');
    let listLocal = document.querySelector('.list-local');
    //удаляем предыдущий список
    titleLocal.remove();
    formLocal.remove();
    listLocal.remove();
    //серверное хранилище
    // const owner = 'Я';
    (async () => {
      const todoItemList = await getTodoList(owner);
      createTodoApp(document.getElementById('todo-app'), {
        title,
        owner,
        todoItemList,
        onCreateFormSubmit: createTodoItem,
        onDoneClick: switchTodoItemDone,
        onDeleteClick: deleteTodoItem,
      });
    })();
  } else {
    btnStorage.classList.remove("pressed");
  }
}

function saveButtonState() {
  const isPressed = btnStorage.classList.contains("pressed");
  localStorage.setItem("buttonState", JSON.stringify(isPressed));
}

// вызов функции при загрузке страницы
window.addEventListener("load", restoreButtonState);

//создал обработчик нажатия на кнопку смены хранилища
btnStorage.addEventListener('click', function () {

  if (!btnStorage.classList.contains('pressed')) {
    btnStorage.textContent = 'Перейти на локальное хранилище';

    //добавление класса кнопки
    btnStorage.classList.add("pressed");
    saveButtonState();

    //нашел заголовок, форму, список дел
    let titleLocal = document.querySelector('.title-local');
    let formLocal = document.querySelector('.form-local');
    let listLocal = document.querySelector('.list-local');
    //удаляем предыдущий список
    titleLocal.remove();
    formLocal.remove();
    listLocal.remove();
    //серверное хранилище
    // const owner = 'Я';
    (async () => {
      const todoItemList = await getTodoList(owner);
      createTodoApp(document.getElementById('todo-app'), {
        title,
        owner,
        todoItemList,
        onCreateFormSubmit: createTodoItem,
        onDoneClick: switchTodoItemDone,
        onDeleteClick: deleteTodoItem,
      });
    })();
  } else {
    btnStorage.textContent = 'Перейти на серверное хранилище'

    //удаление класса кнопки
    btnStorage.classList.remove("pressed");
    saveButtonState();

    //нашел заголовок, форму, список дел
    let titleApi = document.querySelector('.title-api');
    let formApi = document.querySelector('.form-api');
    let listApi = document.querySelector('.list-api');
    //удаляем предыдущий список api
    titleApi.remove();
    formApi.remove();
    listApi.remove();
    //отрисовываем локальное приложение
    createTodoAppLocal(document.getElementById('todo-app'), title, keyName);
  }
})
