//создаем и возвращаем заголовок приложения
function createAppTitle(title) {
  const appTitle = document.createElement('h2');
  appTitle.classList.add('title-api');
  appTitle.innerHTML = title;
  return appTitle;
}

// создаем и возвращаем форму для создания дел
function createTodoItemForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWrapper = document.createElement('div');
  let button = document.createElement('button');

  form.classList.add('input-group', 'mb-3', 'form-api');
  input.classList.add('form-control');
  input.placeholder = "Введите название нового дела";
  buttonWrapper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary');
  button.setAttribute('id', 'buttonId');
  button.disabled = true;
  button.textContent = 'Добавить дело';

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  // создаем событие для активации кнопки при активном input
  input.addEventListener('input', () => {
    if (input.value !== "") {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  });

  return {
    form,
    input,
    button
  };
}

// создаем и возвращаем список элементов ul
function createTodoList() {
  let list = document.createElement('ul');
  list.classList.add('list-group', 'list-api');
  return list;
}

function createTodoItemElement(todoItem, { onDone, onDelete }) {
  const doneClass = 'list-group-item-success'

  // создаем элемент списка
  let item = document.createElement('li');
  // кнопки помещаем в элемент, который красим покажет их в одной  группе
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');
  // устанавливаем стили для элемента списка, а также для размещения кнопок
  // в его правой части с помощью флекс
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  if (todoItem.done) {
    item.classList.add(doneClass)
  }
  item.textContent = todoItem.name;

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success')
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger')
  deleteButton.textContent = 'Удалить';

  // добавляем обработчик на кнопки
  doneButton.addEventListener('click', function () {
    onDone({ todoItem, element: item });
    item.classList.toggle(doneClass, todoItem.done);
  });

  deleteButton.addEventListener('click', function () {
    onDelete({ todoItem, element: item });
  });

  // вкладываем кнопки в отдельный элемент, что бы они объединились в один блок
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  // приложению нужен доступ к самому элементу и кнопкам, что бы обрабатывать события нажатия
  return item;
}

// создаем всё приложение
async function createTodoApp(container, {
  title,
  owner,
  todoItemList = [],
  onCreateFormSubmit,
  onDoneClick,
  onDeleteClick,
}) {
  // создаем переменные с функциями
  const todoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();
  const handlers = { onDone: onDoneClick, onDelete: onDeleteClick };
  // добавляем переменнные в контейнер в дом дерево
  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  todoItemList.forEach(todoItem => {
    const todoItemElement = createTodoItemElement(todoItem, handlers);
    todoList.append(todoItemElement);
  });

  // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
  todoItemForm.form.addEventListener('submit', async e => {
    // эта строчка необходима, что предотвратить стандартное действие браузера
    // в данном случае мы не хотим что бы страница перезагружалась при отправке формы
    e.preventDefault();

    // игнорируем создание элемента, если пользователь ничего не ввел в поле
    if (!todoItemForm.input.value) {
      return;
    }

    const todoItem = await onCreateFormSubmit({
      owner,
      name: todoItemForm.input.value.trim(),
    });

    const todoItemElement = createTodoItemElement(todoItem, handlers);

    // создаем и добавляем в список новое дело с названием из поля для ввода
    todoList.append(todoItemElement);

    // обнуляем значение в поле, что бы не прищлось стирать его в ручную
    todoItemForm.input.value = '';

    // деактивируем кнопку после создания нового дела
    todoItemForm.button.disabled = true;
  });
}

export { createTodoApp, createAppTitle };


