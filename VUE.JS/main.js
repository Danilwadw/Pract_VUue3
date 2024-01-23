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
        checkYear: function() {
            const yearInput = document.querySelector('input[type="date"]');
            const enteredYear = yearInput.value.slice(0, 4);

            if (enteredYear.length !== 4) {
                console.log('Ошибка! Год должен состоять из четырех цифр.');
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
    },
});