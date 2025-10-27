// Vanilla JavaScript - Static Version with LocalStorage
document.addEventListener('DOMContentLoaded', function() {
    setupAddCardButton();
    loadQuadros();

    // Load all quadros from storage
    function loadQuadros() {
        const quadros = storage.getQuadros();
        if (quadros.length > 0) {
            quadros.forEach(card => {
                createCardElement(card);
            });
        }
    }

    // Create card element from template
    function createCardElement(card) {
        const template = document.getElementById('template-quadro');
        const clone = template.content.cloneNode(true);
        
        // Set card data
        clone.querySelector('.name-card').textContent = card.description;
        clone.querySelector('.board-column-header').dataset.id = card.id;
        
        const cardElement = clone.querySelector('.board-column');
        const header = cardElement.querySelector('.board-column-header');
        const idCard = card.id;
        
        // Setup delete button
        const deleteBtn = clone.querySelector('.icon-delete-card');
        deleteBtn.addEventListener('click', function() {
            deleteCard(idCard, cardElement);
        });
        
        // Setup add task button
        const addTaskBtn = clone.querySelector('.add-task-btn');
        addTaskBtn.addEventListener('click', function() {
            showAddTaskInput(idCard, cardElement);
        });
        
        // Setup card name edit
        const nameCard = clone.querySelector('.name-card');
        nameCard.addEventListener('click', function() {
            editCardName(nameCard, idCard);
        });
        
        // Setup drop zone
        const dropZone = clone.querySelector('.board-column-body');
        setupDropZone(dropZone, idCard);
        
        // Load tasks for this card
        loadTasks(idCard, cardElement);
        
        // Append to board
        document.querySelector('.task-board').appendChild(clone);
    }

    // Delete card
    function deleteCard(idCard, cardElement) {
        if (confirm('Deseja realmente excluir este quadro e todas as suas tarefas?')) {
            storage.deleteQuadro(idCard);
            cardElement.remove();
        }
    }

    // Setup add card button
    function setupAddCardButton() {
        const addBtn = document.querySelector('.add-quadro-btn');
        addBtn.addEventListener('click', function() {
            showAddCardInput();
        });
    }

    // Show input to add new card
    function showAddCardInput() {
        const template = document.getElementById('template-quadro');
        const clone = template.content.cloneNode(true);
        
        const inputTemplate = document.getElementById('template-task-input');
        const inputClone = inputTemplate.content.cloneNode(true);
        
        // Replace card name with input
        const nameCard = clone.querySelector('.name-card');
        const columnName = clone.querySelector('.column-name');
        columnName.innerHTML = '';
        columnName.appendChild(inputClone);
        
        const input = columnName.querySelector('.field-name-task');
        
        input.addEventListener('change', function() {
            const cardName = input.value.trim();
            if (cardName.length > 0) {
                createNewCard(cardName, clone, columnName);
            }
        });
        
        document.querySelector('.task-board').appendChild(clone);
        input.focus();
    }

    // Create new card
    function createNewCard(description, clonedElement, columnName) {
        const newCard = storage.createQuadro(description);
        
        // Update the element with real data
        const cardElement = clonedElement.querySelector ? clonedElement.querySelector('.board-column') : clonedElement;
        const header = cardElement.querySelector('.board-column-header');
        header.dataset.id = newCard.id;
        
        columnName.innerHTML = `<h2 class="name-card">${newCard.description}</h2>`;
        
        const nameCard = columnName.querySelector('.name-card');
        nameCard.addEventListener('click', function() {
            editCardName(nameCard, newCard.id);
        });
        
        // Setup delete button
        const deleteBtn = cardElement.querySelector('.icon-delete-card');
        deleteBtn.addEventListener('click', function() {
            deleteCard(newCard.id, cardElement);
        });
        
        // Setup add task button
        const addTaskBtn = cardElement.querySelector('.add-task-btn');
        addTaskBtn.addEventListener('click', function() {
            showAddTaskInput(newCard.id, cardElement);
        });
        
        // Setup drop zone
        const dropZone = cardElement.querySelector('.board-column-body');
        setupDropZone(dropZone, newCard.id);
    }

    // Edit card name
    function editCardName(nameElement, idCard) {
        const currentName = nameElement.textContent.trim();
        const inputTemplate = document.getElementById('template-task-input');
        const inputClone = inputTemplate.content.cloneNode(true);
        const input = inputClone.querySelector('.field-name-task');
        
        input.value = currentName;
        
        const parent = nameElement.parentElement;
        parent.innerHTML = '';
        parent.appendChild(inputClone);
        
        const inputField = parent.querySelector('.field-name-task');
        inputField.focus();
        
        inputField.addEventListener('blur', function() {
            parent.innerHTML = `<h2 class="name-card">${currentName}</h2>`;
            const newNameCard = parent.querySelector('.name-card');
            newNameCard.addEventListener('click', function() {
                editCardName(newNameCard, idCard);
            });
        });
        
        inputField.addEventListener('change', function() {
            const newName = inputField.value.trim();
            if (newName.length > 0) {
                updateCardName(idCard, newName, parent);
            }
        });
    }

    // Update card name
    function updateCardName(idCard, description, parent) {
        const result = storage.updateQuadro(idCard, description);
        if (result) {
            parent.innerHTML = `<h2 class="name-card">${result.description}</h2>`;
            const newNameCard = parent.querySelector('.name-card');
            newNameCard.addEventListener('click', function() {
                editCardName(newNameCard, idCard);
            });
        }
    }

    // Load tasks for a card
    function loadTasks(idCard, cardElement) {
        const tasks = storage.getTarefasByQuadro(idCard);
        if (tasks.length > 0) {
            tasks.forEach(task => {
                createTaskElement(task, cardElement);
            });
        }
    }

    // Create task element
    function createTaskElement(task, cardElement) {
        const template = document.getElementById('template-task');
        const clone = template.content.cloneNode(true);
        
        const taskItem = clone.querySelector('.list-card-item');
        taskItem.dataset.id = task.id;
        taskItem.setAttribute('draggable', 'true');
        
        clone.querySelector('.text-item').textContent = task.description;
        
        // Setup delete button
        const deleteBtn = clone.querySelector('.icon-trash');
        deleteBtn.addEventListener('click', function() {
            deleteTask(task.id, taskItem);
        });
        
        // Setup edit on click
        const textItem = clone.querySelector('.text-item');
        textItem.addEventListener('click', function() {
            editTaskName(textItem, task.id, task.quadroId);
        });
        
        // Setup drag and drop
        setupDraggable(taskItem);
        
        const listCard = cardElement.querySelector('.list-card');
        listCard.appendChild(clone);
    }

    // Show add task input
    function showAddTaskInput(idCard, cardElement) {
        const listCard = cardElement.querySelector('.list-card');
        
        // Check if there's already an input
        if (listCard.querySelector('.form')) {
            return;
        }
        
        const inputTemplate = document.getElementById('template-task-input');
        const inputClone = inputTemplate.content.cloneNode(true);
        const input = inputClone.querySelector('.field-name-task');
        
        listCard.appendChild(inputClone);
        
        const inputField = listCard.querySelector('.field-name-task');
        inputField.focus();
        
        inputField.addEventListener('blur', function() {
            const form = inputField.closest('.form');
            if (form) {
                form.remove();
            }
        });
        
        inputField.addEventListener('change', function() {
            const taskName = inputField.value.trim();
            if (taskName.length > 0) {
                createNewTask(taskName, idCard, cardElement);
                const form = inputField.closest('.form');
                if (form) {
                    form.remove();
                }
            }
        });
    }

    // Create new task
    function createNewTask(description, quadroId, cardElement) {
        const newTask = storage.createTarefa(description, quadroId);
        createTaskElement(newTask, cardElement);
    }

    // Delete task
    function deleteTask(idTask, taskElement) {
        storage.deleteTarefa(idTask);
        taskElement.remove();
    }

    // Edit task name
    function editTaskName(textElement, idTask, idCard) {
        const currentName = textElement.textContent.trim();
        const inputTemplate = document.getElementById('template-task-input');
        const inputClone = inputTemplate.content.cloneNode(true);
        const input = inputClone.querySelector('.field-name-task');
        
        input.value = currentName;
        
        const taskItem = textElement.closest('.list-card-item');
        const originalHTML = taskItem.innerHTML;
        
        taskItem.innerHTML = '';
        taskItem.appendChild(inputClone);
        
        const inputField = taskItem.querySelector('.field-name-task');
        inputField.focus();
        
        inputField.addEventListener('blur', function() {
            taskItem.innerHTML = originalHTML;
            setupTaskEvents(taskItem, idTask, idCard);
        });
        
        inputField.addEventListener('change', function() {
            const newName = inputField.value.trim();
            if (newName.length > 0 && newName !== currentName) {
                updateTaskName(idTask, newName, taskItem, idCard);
            }
        });
    }

    // Update task name
    function updateTaskName(idTask, description, taskItem, idCard) {
        const result = storage.updateTarefa(idTask, description);
        if (result) {
            const template = document.getElementById('template-task');
            const clone = template.content.cloneNode(true);
            const clonedTaskItem = clone.querySelector('.list-card-item');
            clonedTaskItem.querySelector('.text-item').textContent = result.description;
            
            taskItem.innerHTML = '';
            // Append all child nodes from the cloned element
            while (clonedTaskItem.firstChild) {
                taskItem.appendChild(clonedTaskItem.firstChild);
            }
            taskItem.dataset.id = idTask;
            taskItem.setAttribute('draggable', 'true');
            
            setupTaskEvents(taskItem, idTask, idCard);
            setupDraggable(taskItem);
        }
    }

    // Setup task events
    function setupTaskEvents(taskItem, idTask, idCard) {
        const deleteBtn = taskItem.querySelector('.icon-trash');
        deleteBtn.addEventListener('click', function() {
            deleteTask(idTask, taskItem);
        });
        
        const textItem = taskItem.querySelector('.text-item');
        textItem.addEventListener('click', function() {
            editTaskName(textItem, idTask, idCard);
        });
        
        setupDraggable(taskItem);
    }

    // Move task to different card
    function moveTaskToCard(idTask, newQuadroId) {
        storage.changeTarefaQuadro(idTask, newQuadroId);
    }

    // Setup drag and drop for tasks
    function setupDraggable(taskElement) {
        taskElement.addEventListener('dragstart', function(e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', taskElement.innerHTML);
            e.dataTransfer.setData('taskId', taskElement.dataset.id);
            taskElement.classList.add('dragging');
        });
        
        taskElement.addEventListener('dragend', function(e) {
            taskElement.classList.remove('dragging');
        });
    }

    // Setup drop zone for cards
    function setupDropZone(dropZone, idCard) {
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            dropZone.style.backgroundColor = '#ffc637';
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            dropZone.style.backgroundColor = '#f8f8f8';
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            dropZone.style.backgroundColor = '#f8f8f8';
            
            const taskId = e.dataTransfer.getData('taskId');
            const draggingElement = document.querySelector('.dragging');
            
            if (draggingElement && taskId) {
                const listCard = dropZone.querySelector('.list-card');
                listCard.appendChild(draggingElement);
                
                // Update task's quadroId in storage
                moveTaskToCard(taskId, idCard);
            }
        });
    }
});
