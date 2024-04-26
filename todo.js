/**
 * first load should check if there is ARRAY of TODOS in the localstorage and render it into the UI else remain blank.
 *
 *
 * {
 * todoItem: "clean the house",
 * id: (date.now() + "").slice(-10),
 * completed: false
 * }
 */
const toggleBTN = document.querySelector('.icon-back');
const root = document.documentElement;
const todoInput = document.querySelector('input');
const todoContainer = document.querySelector('ul');
const btnsCOnt = document.querySelector('.btns');
let todoArr = localStorage.getItem('todos')
  ? JSON.parse(localStorage.getItem('todos'))
  : [];

if (todoInput.value != '') {
  document.querySelector('.input-placeholder').style.display = 'none';
}

let theme = localStorage.getItem('theme');

if (theme && theme === 'dark') {
  root.classList.add('dark');
} else {
  root.classList.remove('dark');
}

const toggleTheme = () => {
  root.classList.toggle('dark');
  if (root.classList.contains('dark')) {
    return localStorage.setItem('theme', 'dark');
  }
  localStorage.setItem('theme', 'light');
};

toggleBTN.addEventListener('click', toggleTheme);

function updateLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todoArr));
}

function addtoDo() {
  if (todoInput.value != '') {
    todoArr.push({
      todo: todoInput.value,
      id: (Date.now() + '').slice(-10),
      completed: false,
    });
    console.log(todoArr);
    updateLocalStorage();
    return todoArr;
  }
}

function render(arr) {
  if (arr.length === 0) {
    todoContainer.innerHTML = '';
    return;
  }

  const html = arr
    .map(
      todo => ` <li class="todo-item ${
        todo.completed && 'checked'
      }" draggable="true">
    <span class="checkbox" tabindex="0" data-id = ${todo.id}></span>
    <span class="todo">${todo.todo}</span>
    <span class="cross" data-id = ${todo.id}></span>
  </li>`
    )
    .join('');

  todoContainer.innerHTML = html;

  const notDone = arr.filter(todo => !todo.completed);

  document.querySelector('#todo-left').textContent =
    notDone.length > 0
      ? `${notDone.length} ${notDone.length <= 1 ? 'item' : 'items'} left`
      : '';
}

todoContainer.addEventListener('click', e => {
  const checkBox = e.target.classList == 'checkbox';
  const cross = e.target.classList == 'cross';
  if (checkBox) {
    todoArr.map((todo, i) => {
      if (e.target.dataset.id === todo.id) {
        todo.completed = !todo.completed;
      }
      updateLocalStorage();
      render(todoArr);
    });
  }

  if (cross) {
    todoArr.find((todo, i) => {
      if (e.target.dataset.id == todo.id) {
        console.log(todo);
        todoArr.splice(i, 1);
      }

      render(todoArr);
      updateLocalStorage();
    });
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addtoDo();
    render(todoArr);
    todoInput.value = '';
    todoInput.focus();
  }
});

const allBTN = document.querySelector('.all-btn');
const activeBTN = document.querySelector('.active-btn');
const completedBTN = document.querySelector('.completed-btn');
const clearBTN = document.querySelector('.clear-btn');
const activeReset = () => {
  document
    .querySelectorAll('.btn')
    .forEach(btn => btn.classList.remove('active'));
};

btnsCOnt.addEventListener('click', e => {
  if (e.target.classList.contains('all-btn')) {
    activeReset();
    allBTN.classList.add('active');
    render(todoArr.filter(todo => todo.completed || !todo.completed));
  }
  if (e.target.classList.contains('active-btn')) {
    activeReset();
    activeBTN.classList.add('active');
    render(todoArr.filter(todo => !todo.completed));
  }
  if (e.target.classList.contains('completed-btn')) {
    activeReset();
    completedBTN.classList.add('active');
    render(todoArr.filter(todo => todo.completed));
  }
});

clearBTN.addEventListener('click', () => {
  todoArr = [];
  updateLocalStorage();
  render(todoArr);
});
render(todoArr);
