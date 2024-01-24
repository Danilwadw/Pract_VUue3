new Vue({
    el: '#app', // Привязка Vue-компонента к элементу с идентификатором 'app'
    data: {
        plannedTasks: [], // Массив для хранения запланированных задач
        inProgressTasks: [], // Массив для хранения задач в процессе выполнения
        testingTasks: [], // Массив для хранения задач на тестировании
        completedTasks: [], // Массив для хранения выполненных задач
        newCardTitle: '', // Переменная для хранения заголовка новой карточки
        newCardDescription: '', // Переменная для хранения описания новой карточки
        newCardDeadline: '', // Переменная для хранения дедлайна новой карточки
    },
    mounted() {
        this.loadTasksFromStorage(); // Загрузка задач из локального хранилища при инициализации Vue-компонента
    },
    watch: {
        // Обработчики изменений в массивах задач
        plannedTasks: {
            handler() {
                this.saveTasksToStorage(); // Сохранение задач в локальное хранилище при изменении plannedTasks
            },
            deep: true, // Глубокое наблюдение за вложенными свойствами массива
        },
        inProgressTasks: {
            handler() {
                this.saveTasksToStorage(); // Сохранение задач в локальное хранилище при изменении inProgressTasks
            },
            deep: true, // Глубокое наблюдение за вложенными свойствами массива
        },
        testingTasks: {
            handler() {
                this.saveTasksToStorage(); // Сохранение задач в локальное хранилище при изменении testingTasks
            },
            deep: true, // Глубокое наблюдение за вложенными свойствами массива
        },
        completedTasks: {
            handler() {
                this.saveTasksToStorage(); // Сохранение задач в локальное хранилище при изменении completedTasks
            },
            deep: true, // Глубокое наблюдение за вложенными свойствами массива
        },
    },
    methods: {
        addCard: function() {
            // Метод для добавления новой карточки задачи
            const newCard = {
                id: Date.now(), // ID новой карточки, генерируемый на основе текущего времени
                title: this.newCardTitle, // Заголовок новой карточки
                description: this.newCardDescription, // Описание новой карточки
                deadline: this.newCardDeadline, // Дедлайн новой карточки
                lastEdited: new Date().toLocaleString(), // Дата последнего редактирования новой карточки
                returnReason: '' // Причина возврата задачи в процесс выполнения
            };

            this.plannedTasks.push(newCard); // Добавление новой карточки в массив запланированных задач
            this.clearForm(); // Очистка полей ввода для новой карточки
        },
        validateDate() {
            // Метод для валидации формата даты
            const yearInput = document.querySelector('input[type="date"]');
            const enteredDate = yearInput.value;
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!dateRegex.test(enteredDate)) {
                console.log('Ошибка! Неправильный формат даты.');
            }
        },
        editCard: function(card) {
            // Метод для редактирования существующей карточки
            const newTitle = prompt('Введите новый заголовок', card.title);
            const newDescription = prompt('Введите новое описание', card.description);

            if (newTitle && newDescription) {
                card.title = newTitle;
                card.description = newDescription;
                card.lastEdited = new Date().toLocaleString(); // Обновление даты последнего редактирования карточки
            }
        },
        deleteCard: function(card) {
            // Метод для удаления карточки
            const column = this.findColumn(card); // Определение столбца, в котором находится карточка

            if (column) {
                column.splice(column.indexOf(card), 1); // Удаление карточки из соответствующего столбца
            }
        },
        moveToInProgress: function(card) {
            // Метод для перемещения карточки в столбец "Задачи в процессе выполнения"
            this.plannedTasks.splice(this.plannedTasks.indexOf(card), 1); // Удаление карточки из массива запланированных задач
            card.lastEdited = new Date().toLocaleString(); // Обновление даты последнего редактирования карточки
            this.inProgressTasks.push(card); // Добавление карточки в массив задач в процессе выполнения
        },
        moveToTesting: function(card) {
            // Метод для перемещения карточки в столбец "Задачи на тестировании"
            this.inProgressTasks.splice(this.inProgressTasks.indexOf(card), 1); // Удаление карточки из массива задач в процессе выполнения
            card.lastEdited = new Date().toLocaleString(); // Обновление даты последнего редактирования карточки
            this.testingTasks.push(card); // Добавление карточки в массив задач на тестировании
        },
        moveToCompleted: function(card) {
            // Метод для перемещения карточки в столбец "Выполненные задачи"
            this.testingTasks.splice(this.testingTasks.indexOf(card), 1); // Удаление карточки из массива задач на тестировании
            card.lastEdited = new Date().toLocaleString(); // Обновление даты последнего редактирования карточки
            this.completedTasks.push(card); // Добавление карточки в массив выполненных задач
        },
        returnToProgress: function(card) {
            // Метод для возврата карточки в столбец "Задачи в процессе выполнения" из столбца "Задачи на тестировании"
            const reason = prompt('Введите причину возврата', '');

            if (reason) {
                this.testingTasks.splice(this.testingTasks.indexOf(card), 1); // Удаление карточки из массива задач на тестировании
                card.lastEdited = new Date().toLocaleString(); // Обновление даты последнего редактирования карточки
                card.returnReason = reason; // Запись причины возврата карточки
                this.inProgressTasks.push(card); // Добавление карточки в массив задач в процессе выполнения
            }
        },
        isDeadlineExpired: function(deadline) {
            // Метод для проверки просрочен ли дедлайн задачи
            const currentDate = new Date();
            const deadlineDate = new Date(deadline);

            return currentDate > deadlineDate; // Возвращает булевое значение - просрочен ли дедлайн
        },
        clearForm: function() {
            // Метод для очистки полей ввода формы для новой карточки
            this.newCardTitle = '';
            this.newCardDescription = '';
            this.newCardDeadline = '';
        },
        findColumn: function(card) {
            // Метод для определения в каком столбце находится карточка
            if (this.plannedTasks.includes(card)) {
                return this.plannedTasks; // Карточка находится в массиве запланированных задач
            } else if (this.inProgressTasks.includes(card)) {
                return this.inProgressTasks; // Карточка находится в массиве задач в процессе выполнения
            } else if (this.testingTasks.includes(card)) {
                return this.testingTasks; // Карточка находится в массиве задач на тестировании
            } else if (this.completedTasks.includes(card)) {
                return this.completedTasks; // Карточка находится в массиве выполненных задач
            } else {
                return null; // Карточка не находится ни в одном из массивов
            }
        },
        saveTasksToStorage() {
            // Метод для сохранения задач в локальное хранилище
            const tasks = {
                plannedTasks: this.plannedTasks,
                inProgressTasks: this.inProgressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks,
            };
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },
        loadTasksFromStorage() {
            // Метод для загрузки задач из локального хранилища
            const tasks = localStorage.getItem('tasks');
            if (tasks) {
                const parsedTasks = JSON.parse(tasks);
                this.plannedTasks = parsedTasks.plannedTasks || [];
                this.inProgressTasks = parsedTasks.inProgressTasks || [];
                this.testingTasks = parsedTasks.testingTasks || [];
                this.completedTasks = parsedTasks.completedTasks || [];
            }
        },
    }
});