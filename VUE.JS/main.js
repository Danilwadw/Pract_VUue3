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

    }
});