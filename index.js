const Data = (() => {
    // Retrieve projects data from local storage, if available, or initialize with a default project
    let projects = JSON.parse(localStorage.getItem('projects')) || [
        {
            title: 'Project 1',
            id: 0,
            todos: []
        }
    ];

    const saveProjectsToLocalStorage = () => {
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    const Project = (title, id) => {
        return {
            title,
            id,
            todos: []
        };
    };

    const addProject = (project) => {
        projects.push(project);
        saveProjectsToLocalStorage();
    };

    const delProject = (projIndex) => {
        projects.splice(projIndex, 1);
        saveProjectsToLocalStorage();
    };

    const Todo = (title, desc, dueDate, priority, id) => {
        return {
            title,
            desc,
            dueDate,
            priority,
            doneStatus: false,
            id
        };
    };

    const delTodo = (projIndex, todoIndex) => {
        projects[projIndex].todos.splice(todoIndex, 1);
        saveProjectsToLocalStorage();
    };

    const addTodo = (projIndex, todo) => {
        projects[projIndex].todos.push(todo);
        saveProjectsToLocalStorage();
    };

    const editTodo = (projIndex, todoIndex, newTitle, newDesc, newPriority, newDueDate) => {
        const todoToUpdate = projects[projIndex].todos[todoIndex];
        todoToUpdate.title = newTitle;
        todoToUpdate.desc = newDesc;
        todoToUpdate.priority = newPriority;
        todoToUpdate.dueDate = newDueDate;
        saveProjectsToLocalStorage();
    };

    return {
        projects,
        Project,
        addProject,
        delProject,
        Todo,
        delTodo,
        editTodo,
        addTodo,
    };
    
})();


// UI module 

const UI = (() => {
    const projectsList = document.querySelector('.projects-container');
    const todosList = document.querySelector('.todos-container');

    let currentProjectIndex = 0;
    
    const renderProject = (data) => {
        projectsList.innerHTML = '';
        data.projects.forEach((project, index) => {
            createProject(project.title, index);
        });
    };

    const createProject = (title, id) => {

        const projectBox = document.createElement('div');
        projectBox.className = 'project';

        projectBox.setAttribute('data', id);

        const deleteProjectBtn = document.createElement('button');
        deleteProjectBtn.classList.add('del-project');
        deleteProjectBtn.textContent = '+';

        projectBox.textContent = title;
        projectBox.appendChild(deleteProjectBtn);
        projectsList.appendChild(projectBox);
    };

    const deleteProject = (project) => {
        const index = project.getAttribute('data');
        Data.projects.splice(index, 1);
        renderProject(Data);
    };


    const renderTodo = (data) => {
        todosList.innerHTML = '';
        data.projects[UI.currentProjectIndex].todos.forEach(todo => {
            createTodo(todo);
        });
    };

    const createTodo = (todo) => {

        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        todoItem.setAttribute('data', todo.id);

        const todoDataArea = document.createElement('div');
        todoDataArea.classList.add('todo-data-area');

        const todoTitleDesc = document.createElement('div');
        todoTitleDesc.classList.add('todo-title-date');

        const todoDueDatePriority = document.createElement('div');
        todoDueDatePriority.classList.add('todo-desc-priority');

        const todoTitle = document.createElement('h2');
        todoTitle.classList.add('todo-title');
        todoTitle.textContent = todo.title;

        const todoDesc = document.createElement('p');
        todoDesc.classList.add('todo-desc');
        todoDesc.textContent = todo.desc;

        const tododueDate = document.createElement('p');
        tododueDate.classList.add('todo-due-date');
        tododueDate.textContent = todo.dueDate;

        const todopriority = document.createElement('h2');
        todopriority.classList.add('todo-priority');
        todopriority.textContent = todo.priority;


        const btnsArea = document.createElement('div');
        btnsArea.classList.add('btns-area');

        const editTodoBtn = document.createElement('button');
        editTodoBtn.classList.add('edit-todo-btn');
        editTodoBtn.textContent = 'Edit';

        const delTodoBtn = document.createElement('button');
        delTodoBtn.classList.add('del-todo-btn');
        delTodoBtn.textContent = 'Delete';
        
        const doneTodoBtn = document.createElement('button');
        doneTodoBtn.classList.add('done-todo-btn');
        todo.doneStatus == false 
        ? doneTodoBtn.textContent = 'Done' 
        : doneTodoBtn.textContent = 'Undo';

        todoTitleDesc.appendChild(todoTitle);
        todoTitleDesc.appendChild(todoDesc);

        todoDueDatePriority.appendChild(tododueDate);
        todoDueDatePriority.appendChild(todopriority);

        todoDataArea.appendChild(todoTitleDesc);
        todoDataArea.appendChild(todoDueDatePriority);
        
        btnsArea.appendChild(editTodoBtn);
        btnsArea.appendChild(delTodoBtn);
        btnsArea.appendChild(doneTodoBtn);

        todoItem.appendChild(todoDataArea);
        todoItem.appendChild(btnsArea);

        todosList.appendChild(todoItem);
    };

    const deleteTodo = (todoIndex) => {
        Data.projects[currentProjectIndex].todos.splice(todoIndex, 1);
        renderTodo(Data);
    };

    const doneTodo = (e) => {
        const doneStatusBtn = e.target;
        const todoItem = e.target.closest('.todo-item');
        const todoIndex = todoItem.getAttribute('data');
        const todo = Data.projects[UI.currentProjectIndex].todos[todoIndex];
    
        todo.doneStatus = !todo.doneStatus;
    
        doneStatusBtn.textContent = todo.doneStatus ? 'Undo' : 'Done';

    };

    return {
        currentProjectIndex,
        renderProject,
        createProject,
        deleteProject,
        renderTodo,
        createTodo,
        deleteTodo,
        doneTodo
    };
})();

// Controller module


const Controller = (() => {

    let TodoIndexForEditing;

    const init = () => {

        UI.renderProject(Data);
        UI.renderTodo(Data);

        const promptProjectDialog = document.getElementById('prompt-project-dialog');
        const promptTodoDialog = document.getElementById('prompt-todo-dialog');
        const projectDialog = document.getElementById('project-dialog');
        const todoDialog = document.getElementById('todos-dialog');
        const closeProjectBtn = document.getElementById('close-project');
        const closeTodoBtn = document.getElementById('close-todo');
        const addProjectBtn = document.getElementById('add-project-btn');
        const addTodoBtn = document.getElementById('add-todo-btn');

        const projectInput = document.getElementById('project-input');
        
        const todoInput = document.getElementById('todo-input');
        const todoDesc = document.getElementById('todo-desc');
        const tododueDate = document.getElementById('todo-due-date');
        const todoPriority = document.getElementById('todo-priority');

        const projectsContainer = document.querySelector('.projects-container');
        const todosList = document.querySelector('.todos-container');

        const editTodoDialog = document.getElementById('edit-todo-dialog');
        const editTodoInput = document.getElementById('edit-todo-input');
        const editTodoDesc = document.getElementById('edit-todo-desc');
        const editTodoDueDate = document.getElementById('edit-todo-due-date');
        const editTodoPriority = document.getElementById('edit-todo-priority');
        const saveTodoBtn = document.getElementById('save-todo-btn');
        const cancelEdit = document.getElementById('cancel-todo');

        promptProjectDialog.addEventListener('click', () => {
            projectDialog.showModal();
        })
        promptTodoDialog.addEventListener('click', () => {
            todoDialog.showModal();
        })
        closeProjectBtn.addEventListener('click', () => {
            projectDialog.close();
        })
        closeTodoBtn.addEventListener('click', () => {
            todoDialog.close();
        })
        addProjectBtn.addEventListener('click', () => {
            if(projectInput.value.trim() != '') {
                const newProject = Data.Project(projectInput.value, Data.projects.length);
                Data.projects.push(newProject);
                projectDialog.close();
                UI.renderProject(Data);
                projectInput.value = '';
            };
        });
        addTodoBtn.addEventListener('click', () => {
            if(todoInput.value.trim() != '' 
                && tododueDate.value != '') {
                const newTodo = Data.Todo(todoInput.value, todoDesc.value, tododueDate.value, todoPriority.value, Data.projects[UI.currentProjectIndex].todos.length);
                Data.addTodo(UI.currentProjectIndex, newTodo);
                todoDialog.close();
                UI.renderTodo(Data);
                todoInput.value = '';
                todoDesc.value = '';
                tododueDate.value = '';
                todoPriority.value = 'low';
            };
        });
        projectsContainer.addEventListener('click', (e) => {
            const project = e.target;

            const projects = document.querySelectorAll('.project');

            projects.forEach(project => {
                project.classList.remove('active');
            })
            if(project.classList.contains('project')) {

                project.classList.add('active');
                todosList.innerHTML = '';
                UI.currentProjectIndex = project.getAttribute('data');
                UI.renderTodo(Data);
            }
            if(project.classList.contains('del-project')) {
                const selectedProjectToDelete = project.closest('.project');
                const indexOfProjectToDelete = selectedProjectToDelete.getAttribute('data');
                Data.projects.splice(indexOfProjectToDelete, 1);
                if(Data.projects.length <= 1) {
                    UI.currentProjectIndex = 0;
                    UI.renderProject(Data);
                    UI.renderTodo(Data);
                } else {
                    UI.currentProjectIndex = indexOfProjectToDelete + 1;
                    UI.renderTodo(Data);
                }
            }
        })
        todosList.addEventListener('click', (e) => {
            const clicked = e.target;

            const clickedTodo = e.target.closest('.todo-item');
            const clickedTodoIndex = clickedTodo.getAttribute('data');

            if(clicked.classList.contains('del-todo-btn')) {
                Data.delTodo(UI.currentProjectIndex, clickedTodoIndex);
                UI.renderTodo(Data);
            };

            if(clicked.classList.contains('done-todo-btn')) {
                UI.doneTodo(e);
            };

            if(clicked.classList.contains('edit-todo-btn')) {

                Controller.TodoIndexForEditing = clickedTodoIndex;

                const dataToEdit = Data.projects[UI.currentProjectIndex].todos[clickedTodoIndex];
                editTodoInput.value = dataToEdit.title;
                editTodoDesc.value = dataToEdit.desc;
                editTodoDueDate.value = dataToEdit.dueDate;
                editTodoPriority.value = dataToEdit.priority;
                editTodoDialog.showModal();
            }
        });
        cancelEdit.addEventListener('click', () => {
            editTodoDialog.close();
        });
        saveTodoBtn.addEventListener('click', () => {
            const dataToSave = Data.projects[UI.currentProjectIndex].todos[Controller.TodoIndexForEditing];
            if(editTodoInput.value != ''
                && editTodoDueDate.value != '') {
                dataToSave.title = editTodoInput.value;
                dataToSave.desc = editTodoDesc.value;
                dataToSave.dueDate = editTodoDueDate.value;
                dataToSave.priority = editTodoPriority.value;
                editTodoDialog.close();

                UI.renderTodo(Data);
            }
        })
    }

    return {
        TodoIndexForEditing,
        init,
    }

})();

Controller.init();




