//TIME CODEBLOCK DECLARATION
const HTMLdate = document.querySelector('.time p');
let hours, minutes, seconds, meridian;

//ADD TO DO CODEBLOCK DECLARATION
const notification = document.querySelector('.modal span');
const timetodo = document.querySelector('#time-to-do').value;
const todo = document.querySelector('#to-do-form').value;
const addRules = document.querySelector('.button');
const exitButton = document.querySelector('.exit-btn');
const modalContainer = document.querySelector('.modal-container');
const body = document.querySelector('body');

//get from local
document.addEventListener('DOMContentLoaded', getTodos);

//addrules
addRules.addEventListener('click', addrule);
exitButton.addEventListener('click', exitBtn);

function updateTime(){
    //put date method inside function so it will keep on updating

    //var declaration
    let dateData = new Date();

    //var declaration
    hours = dateData.getHours();
    //Small if to add 0  in minutes. Prevent 8:1 PM format.
    minutes = dateData.getMinutes();
    if (minutes <= 9){
        minutes = `0${minutes}`;
    }
    seconds = dateData.getSeconds();

    //if else for meridian
    if(hours >= 13){
        hours -= 12;
        meridian = "PM";
    }else{
        meridian = "AM";
    }

    //DOM
    HTMLdate.innerText = `${hours}:${minutes}:${seconds} ${meridian}`;
}
//Function so the time gets loaded immediately vs loaded only when called by setInterval
updateTime();
setInterval(updateTime,1000);

// ADD TO DO
const buttonlisten = document.getElementById('submit-btn');
buttonlisten.addEventListener('click', getTasks);
const todoDiv = document.querySelector('.todo-list');

function getTasks(){
    const timetodo = document.querySelector('#time-to-do').value;
    const todo = document.querySelector('#to-do-form').value;
    
    if(timetodo === '' || todo === ''){
        notification.innerText = 'Input required';
    }else{
        //style
        exitBtn();
        notification.innerText = '';
        //style

        let slicedhours = timetodo.slice(0,2);
        let slicedminutes = timetodo.slice(2);
        let meridiansliced;
        //inarte IF ELSE
        if(slicedhours >= 12){
            slicedhours -= 12;
            meridiansliced = 'PM';
        }else if(slicedhours <= 12 && slicedhours >= 9){
            meridiansliced = 'AM';
            console.log(slicedhours);
            console.log(timetodo);
        }else{
            slicedhours = timetodo.slice(1,2);
            meridiansliced = 'AM';
            console.log(slicedhours);
            console.log(timetodo);
        }
        //To do  div
        const todoItemDiv =  document.createElement('div');
        todoItemDiv.classList = ('todo-item-wrapper');
        //Li
        const newTodoItem = document.createElement('li');
        newTodoItem.innerText  = `${slicedhours}${slicedminutes}${meridiansliced} ${todo}`;
        newTodoItem.classList = ('to-do-item');
        todoItemDiv.appendChild(newTodoItem);
        //SAVE TO LOCAL
        saveLocalTodo(`${slicedhours}${slicedminutes}${meridiansliced} ${todo}`);
        //SAVE TO LOCAL
        //checkbox
        const completedButton = document.createElement('button');
        completedButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16">
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
        </svg>`;
        completedButton.classList = ('complete-btn');
        todoItemDiv.appendChild(completedButton);
        //delete button
        const deleteButton =  document.createElement('button');
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
        </svg>`;
        deleteButton.classList = 'delete-btn';
        todoItemDiv.appendChild(deleteButton);
        //APPEND THE DIV TO UL
        todoDiv.appendChild(todoItemDiv);
    }
    document.querySelector('#to-do-form').value='';
    document.querySelector('#time-to-do').value='';
}

const deleteListener = document.querySelector('.todo-list');
deleteListener.addEventListener('click', checkDelete);
function checkDelete(event){
    const item = event.target;
    if(item.classList[0] === 'delete-btn'){
        const todo = item.parentElement;
        todo.classList.add('goodbye');

        //prevent deleting from both JSON file
        let code = 0;
        if(todo.classList[1] === 'completed'){
            code = 1;
        }

        removeTodofromStorage(todo,code);
        todo.addEventListener('transitionend',function(){
            todo.remove();
        });
    }
    if(item.classList[0] === 'complete-btn'){
        const todo =  item.parentElement;
        todo.classList.toggle('completed');
    
        let todoCompleted = JSON.parse(localStorage.getItem('todoCompleted'));
        let todos = JSON.parse(localStorage.getItem('todos'));
        // todoCompleted.push(todo.children[0].innerText);
        // localStorage.setItem('todoCompleted', JSON.stringify(todoCompleted));
        
        switch (todo.classList[1]) {
            case 'completed':
                //ADD to completed json
                todoCompleted.push(todo.children[0].innerText);
                localStorage.setItem('todoCompleted', JSON.stringify(todoCompleted));

                //remove from todo JSON
                const todoIndex = todo.children[0].innerText;
                todos.splice(todos.indexOf(todoIndex), 1);
                localStorage.setItem('todos', JSON.stringify(todos));
                break;
        
            case null:
                
            default:
                //remove from completed JSON
                const todoIndexCompleted = todo.children[0].innerText;
                todoCompleted.splice(todoCompleted.indexOf(todoIndexCompleted), 1);
                localStorage.setItem('todoCompleted', JSON.stringify(todoCompleted));
                console.log('hello world');

                //add again to todo JSON
                todos.push(todo.children[0].innerText);
                localStorage.setItem('todos', JSON.stringify(todos));
                break;
        }
    }
}   
function saveLocalTodo(todo){
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}
function getTodos() {
    let todos, todoCompleted;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    //minicode to initialize todocompleted json===
    if(localStorage.getItem('todoCompleted') === null){
        todoCompleted = [];
    }else{
        todoCompleted = JSON.parse(localStorage.getItem('todoCompleted'));
    }
    localStorage.setItem('todoCompleted', JSON.stringify(todoCompleted));
    //====

    
    todos.forEach(todo => {
        //To do  div
        const todoItemDiv =  document.createElement('div');
        todoItemDiv.classList = ('todo-item-wrapper');
        //Li
        const newTodoItem = document.createElement('li');
        newTodoItem.innerText  = todo;
        newTodoItem.classList = ('to-do-item');
        todoItemDiv.appendChild(newTodoItem);
        //checkbox
        const completedButton = document.createElement('button');
        completedButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16">
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
        </svg>`;
        completedButton.classList = ('complete-btn');
        todoItemDiv.appendChild(completedButton);
        //delete button
        const deleteButton =  document.createElement('button');
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
        </svg>`;
        deleteButton.classList = 'delete-btn';
        todoItemDiv.appendChild(deleteButton);
        //APPEND THE DIV TO UL
        todoDiv.appendChild(todoItemDiv);
    });
    todoCompleted.forEach(todo => {
        //To do  div
        const todoItemDiv =  document.createElement('div');
        todoItemDiv.classList = ('todo-item-wrapper');
        todoItemDiv.classList.add('completed');
        //Li
        const newTodoItem = document.createElement('li');
        newTodoItem.innerText  = todo;
        newTodoItem.classList = ('to-do-item');
        todoItemDiv.appendChild(newTodoItem);
        //checkbox
        const completedButton = document.createElement('button');
        completedButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16">
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
        </svg>`;
        completedButton.classList = ('complete-btn');
        todoItemDiv.appendChild(completedButton);
        //delete button
        const deleteButton =  document.createElement('button');
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
        </svg>`;
        deleteButton.classList = 'delete-btn';
        todoItemDiv.appendChild(deleteButton);
        //APPEND THE DIV TO UL
        todoDiv.appendChild(todoItemDiv);
    });
}

function removeTodofromStorage(todo, code) {
    if (code === 0){
        //todos
        let todos = JSON.parse(localStorage.getItem('todos'));
        const todoIndex = todo.children[0].innerText;
        todos.splice(todos.indexOf(todoIndex), 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    }else{
        //completed
        let todoCompleted = JSON.parse(localStorage.getItem('todoCompleted'));
        const todoIndexCompleted = todo.children[0].innerText;
        todoCompleted.splice(todoCompleted.indexOf(todoIndexCompleted), 1);
        localStorage.setItem('todoCompleted', JSON.stringify(todoCompleted));
    }

    
}
function addrule(){
    modalContainer.classList.add('show');
    console.log('hello world');
    body.style.setProperty('overflow','hidden');
}
function exitBtn(){
    modalContainer.classList.remove('show');
    body.style.removeProperty('overflow');
}