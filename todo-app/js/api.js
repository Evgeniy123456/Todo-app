//получение списка дел
export async function getTodoList(owner) {

  //отправляем запрос на весь список дел
  const responce = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
  return await responce.json();
}
//создание нового дела
export async function createTodoItem({ owner, name }) {
  const responce = await fetch("http://localhost:3000/api/todos", {
    method: 'POST',
    body: JSON.stringify({
      name,
      owner,
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return await responce.json();
}
//смена статуса дела
export function switchTodoItemDone({ todoItem }) {
  todoItem.done = !todoItem.done;
  fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done: todoItem.done }),
    headers: {
      'Content-Type': 'application/json',
    }
  });
}
//удаление дела из списка
export function deleteTodoItem({ element, todoItem}) {
  if (!confirm('Вы уверены?')) {
    return;
  }
  element.remove();
  fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
    method: 'DELETE',
  });
}
