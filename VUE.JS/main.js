new Vue({
    el: '#app',
    data: {
        plannedTasks: [],
        inProgressTasks: [],
        testingTasks: [],
        completedTasks: [],
        newCardTitle: '',
        newCardDescription: '',
        newCardDeadline: '',
    },
    mounted() {
        this.loadTasksFromStorage();
    },
    watch: {
        plannedTasks: {
            handler() {
                this.saveTasksToStorage();
            },
            deep: true,
        },
        inProgressTasks: {
            handler() {
                this.saveTasksToStorage();
            },
            deep: true,
        },
        testingTasks: {
            handler() {
                this.saveTasksToStorage();
            },
            deep: true,
        },
        completedTasks: {
            handler() {
                this.saveTasksToStorage();
            },
            deep: true,
        },
    },
    methods: {
        addCard: function() {
            const newCard = {
                id: Date.now(),
                title: this.newCardTitle,
                description: this.newCardDescription,
                deadline: this.newCardDeadline,
                lastEdited: new Date().toLocaleString(),
                returnReason: ''
            };

            this.plannedTasks.push(newCard);
            this.clearForm();
        },
        validateDate() {
            const yearInput = document.querySelector('input[type="date"]');
            const enteredDate = yearInput.value;
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!dateRegex.test(enteredDate)) {
                console.log('Ошибка! Неправильный формат даты.');
            }
        },
        editCard: function(card) {
            const newTitle = prompt('Введите новый заголовок', card.title);
            const newDescription = prompt('Введите новое описание', card.description);

            if (newTitle && newDescription) {
                card.title = newTitle;
                card.description = newDescription;
                card.lastEdited = new Date().toLocaleString();
            }
        },
        deleteCard: function(card) {
            const column = this.findColumn(card);

            if (column) {
                column.splice(column.indexOf(card), 1);
            }
        },
        moveToInProgress: function(card) {
            this.plannedTasks.splice(this.plannedTasks.indexOf(card), 1);
            card.lastEdited = new Date().toLocaleString();
            this.inProgressTasks.push(card);
        },
        moveToTesting: function(card) {
            this.inProgressTasks.splice(this.inProgressTasks.indexOf(card), 1);
            card.lastEdited = new Date().toLocaleString();
            this.testingTasks.push(card);
        },
        moveToCompleted: function(card) {
            this.testingTasks.splice(this.testingTasks.indexOf(card), 1);
            card.lastEdited = new Date().toLocaleString();
            this.completedTasks.push(card);
        },
        returnToProgress: function(card) {
            const reason = prompt('Введите причину возврата', '');

            if (reason) {
                this.testingTasks.splice(this.testingTasks.indexOf(card), 1);
                card.lastEdited = new Date().toLocaleString();
                card.returnReason = reason;
                this.inProgressTasks.push(card);
            }
        },
        isDeadlineExpired: function(deadline) {
            const currentDate = new Date();
            const deadlineDate = new Date(deadline);

            return currentDate > deadlineDate;
        },
        clearForm: function() {
            this.newCardTitle = '';
            this.newCardDescription = '';
            this.newCardDeadline = '';
        },
        findColumn: function(card) {
            if (this.plannedTasks.includes(card)) {
                return this.plannedTasks;
            } else if (this.inProgressTasks.includes(card)) {
                return this.inProgressTasks;
            } else if (this.testingTasks.includes(card)) {
                return this.testingTasks;
            } else if (this.completedTasks.includes(card)) {
                return this.completedTasks;
            } else {
                return null;
            }
        },
        saveTasksToStorage() {
            const tasks = {
                plannedTasks: this.plannedTasks,
                inProgressTasks: this.inProgressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks,
            };
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },
        loadTasksFromStorage() {
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