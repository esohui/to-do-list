// todo
const addTodoBtn = document.querySelector('.add__todo__btn');
const addTodoInput = document.querySelector('#add__todo__input');
const all = document.querySelector('.all');
const allCheck = document.querySelector('#all__check');
const allDeleteBtn = document.querySelector('.all__delete');
const contents = document.querySelector('.contents');
let content = document.querySelectorAll('.content');
let complete = document.querySelectorAll('input[name="todo"]:checked');
let contentDeleteBtn = document.querySelectorAll('.content__delete');
let title = document.querySelector('.title');
let todoCount = document.querySelector('.count');
todoCount.textContent = `전체: ${content.length} | 진행중: ${content.length - complete.length} | 완료: ${complete.length}`;

// list
const addListBox = document.querySelector('.add__list__box');
const addListBtn = document.querySelector('.add__list__btn');
const addListInput = document.querySelector('.add__list__input');
const addListBtnReal = document.querySelector('.add__list__btn__real');
const addListUl = document.querySelector('.list ul');
const todoSection = document.querySelector('.todo');
let listBox = document.querySelector('.list__box');
let listBoxEach = document.querySelectorAll('.list__box__each');
let listDeleteBtn = document.querySelectorAll('.list__delete__btn');

function addToDo() {
  if (addTodoInput.value === '') {
    alert('할일을 입력해 주세요!');
    return;
  }

  const count = contents.childElementCount + 1;
  const newContent = `<div class="content">
                            <div class="content__box">
                            <input type="checkbox" id="content${count}" name="todo"/>
                            <label for="content${count}">${addTodoInput.value}</label>
                      </div>
                      <button class="content__delete"><i class="fa-solid fa-trash-can"></i></button>`;
  contents.innerHTML += newContent;
  addTodoInput.value = '';
  allCheck.checked = false;
}
function addList() {
  if (addListInput.value === '') {
    alert('목록명을 입력해 주세요!');
    return;
  }
  const newList = `<li class="list__box__each">
                    <div>${addListInput.value}</div>
                    <button class="list__delete__btn"><i class="fa-solid fa-trash-can"></i></button>
                  </li>`;
  addListUl.innerHTML += newList;
  addListInput.value = '';
  if (listBoxEach.length === 0) {
    all.innerHTML = `<div>
                      <input type="checkbox" id="all__check" />
                      <label for="all__check">전체 선택</label>
                    </div>
                    <button class="all__delete">전체 삭제</button>`;
  }
}
function removeTodo() {
  for (const cdb of contentDeleteBtn) {
    cdb.addEventListener('click', (e) => {
      e.target.parentNode.parentNode.remove();
    });
  }
}
function setTodoCount() {
  complete = document.querySelectorAll('input[name="todo"]:checked');
  todoCount.textContent = `전체: ${content.length} | 진행중: ${content.length - complete.length} | 완료: ${complete.length}`;
}
function setTodoChecked() {
  let inputTodo = contents.querySelectorAll('input[name="todo"]');
  for (let itd of inputTodo) {
    if (itd.getAttribute('aria-checked') === 'true') {
      itd.checked = true;
    }
  }
}
function changeInputId() {
  const inputAll = contents.querySelectorAll('input[name="todo"]');
  const labelAll = contents.querySelectorAll('label');
  let idCount = 1;
  for (const id of inputAll) {
    id.setAttribute('id', `content${idCount}`);
    idCount++;
  }
  idCount = 1;
  for (const id of labelAll) {
    id.setAttribute('for', `content${idCount}`);
    idCount++;
  }
}
function saveTodoList() {
  title = todoSection.querySelector('.title');
  let key = title.textContent;
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
  }
  let todoListObjKey = [];
  let todoListChecked = [];
  let todoListContent = [];
  let todoListObj = {};
  let count = 1;
  for (const ct of content) {
    todoListObjKey.push(`obj${count}`);
    todoListChecked.push(ct.querySelector('input').getAttribute('aria-checked') === 'true' ? true : false);
    todoListContent.push(ct.querySelector('label').textContent);
    count++;
  }
  for (let i = 0; i < todoListObjKey.length; i++) {
    let key = todoListObjKey[i];
    todoListObj[key] = { content: todoListContent[i], checked: todoListChecked[i] };
  }
  const todoListJson = JSON.stringify(todoListObj);
  localStorage.setItem(key, todoListJson);
}

function removeList() {
  for (const ldb of listDeleteBtn) {
    ldb.addEventListener('click', (e) => {
      const target = e.target.parentNode.parentNode;
      localStorage.removeItem(target.children[0].innerText);
      target.remove();
      if (!!listBox.children[0]) {
        const key = listBox.children[0].children[0].textContent;
        changeTodoView(key);
      } else {
        all.innerHTML = '';
        contents.innerHTML = '';
        todoCount.textContent = '';
        title.innerText = '목록이 없습니다.';
      }
    });
  }
}

function changeTodoView(key) {
  allCheck.checked = false;
  contents.innerHTML = '';
  todoSection.querySelector('.title').textContent = key;
  const todoListObj = JSON.parse(localStorage.getItem(key));
  let todoListLength = Object.keys(todoListObj).length;
  for (let i = 0; i < todoListLength; i++) {
    let newContent = `<div class="content">
                            <div class="content__box">
                            <input type="checkbox" id="content${i + 1}" name="todo" aria-checked="${Object.values(todoListObj)[i].checked}"/>
                            <label for="content${i + 1}">${Object.values(todoListObj)[i].content}</label>
                      </div>
                      <button class="content__delete">❌</button>`;
    contents.innerHTML += newContent;
  }
  content = document.querySelectorAll('.content');
  for (const ct of content) {
    let isChecked = ct.querySelector('input').getAttribute('aria-checked') === 'true' ? true : false;
    ct.querySelector('input').checked = isChecked;
  }
}

document.addEventListener('change', (e) => {
  if (e.target === allCheck) {
    if (allCheck.checked) {
      for (const ct of content) {
        ct.querySelector('input').setAttribute('aria-checked', 'true');
        ct.querySelector('input').checked = allCheck.checked;
      }
    } else {
      for (const ct of content) {
        ct.querySelector('input').setAttribute('aria-checked', 'false');
        ct.querySelector('input').checked = allCheck.checked;
      }
    }
  } else {
    e.target.setAttribute('aria-checked', e.target.checked);
  }
  setTodoCount();
});

document.addEventListener('click', (e) => {
  if (e.target === allDeleteBtn) {
    contents.innerHTML = '';
    allCheck.checked = false;
    return;
  }
  if (e.target === addTodoBtn) {
    addToDo();
    setTodoChecked();
    return;
  }
  if (e.target === addListBtn) {
    if (addListBox.style.display === 'flex') {
      addListBox.style.display = 'none';
      addListBtn.style.backgroundColor = '#e7365b';
      addListBtn.textContent = '목록 추가';
      addListBtn.classList.remove('hide');
    } else {
      addListBox.style.display = 'flex';
      addListBtn.style.backgroundColor = '#243D54';
      addListBtn.textContent = '목록 숨기기';
      addListBtn.classList.add('hide');
    }
  }
  if (e.target === addListBtnReal) {
    title.innerText = addListInput.value;
    addList();
    saveTodoList();
    todoSection.querySelector('.title').innerText = title;
    return;
  }
  if (e.target.parentNode.parentNode === listBox) {
    saveTodoList();
    changeTodoView(e.target.innerText);
  }
});

document.addEventListener('keypress', (e) => {
  if (e.target === addTodoInput) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addToDo();
      setTodoChecked();
    }
    return;
  }
  if (e.target === addListInput) {
    if (e.key === 'Enter') {
      title.innerText = addListInput.value;
      e.preventDefault();
      addList();
      saveTodoList();
      content = '';
      complete = '';
      contents.innerHTML = '';
      todoCount.textContent = `전체: ${content.length} | 진행중: ${content.length - complete.length} | 완료: ${complete.length}`;
      todoSection.querySelector('.title').innerText = title.innerText;
    }
    return;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  saveTodoList();
});
window.onbeforeunload = function (e) {
  e.preventDefault();
  localStorage.clear();
};

addListBtn.addEventListener('mouseover', () => {
  if (!addListBtn.classList.contains('hide')) {
    addListBtn.style.backgroundColor = '#bc2242';
  } else {
    addListBtn.style.backgroundColor = '#16253D';
  }
});
addListBtn.addEventListener('mouseout', () => {
  if (!addListBtn.classList.contains('hide')) {
    addListBtn.style.backgroundColor = '#e7365b';
  } else {
    addListBtn.style.backgroundColor = '#243D54';
  }
});

removeTodo();
removeList();

// 노드 변경 감지
let contentObserver = new MutationObserver(() => {
  content = document.querySelectorAll('.content');
  contentDeleteBtn = document.querySelectorAll('.content__delete');
  removeTodo();
  setTodoCount();
  changeInputId();
});
let listObserver = new MutationObserver(() => {
  listBoxEach = document.querySelectorAll('.list__box__each');
  listDeleteBtn = document.querySelectorAll('.list__delete__btn');
  removeList();
  setTodoCount();
});
let option = {
  attributes: true,
  childList: true,
  characterDate: true,
};
contentObserver.observe(contents, option);
listObserver.observe(listBox, option);
// --------------------
