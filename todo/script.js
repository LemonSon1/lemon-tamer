const filters = {
    all: function (todos) {
        return todos;
    },

    complete: function (todos) {
        return todos.filter(function (todo) {
            return todo.complete;
        });
    },

    incomplete: function (todos) {
        return todos.filter(function (todo) {
            return !todo.complete;
        });
    }
};


const STORAGE_KEY = "vue-js-todo-P7oZi9sL";


const todoStorage = {

    fetch: function () {
        try {
            const todos = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(todos) ? todos : [];

        } catch (error) {
            console.error("Could not load todos:", error);

            return [];
        }
    },

    save: function (todos) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(todos)
        );
    }
};


const app = new Vue({

    el: "#app",

    data: {
        inputVal: "",
        todos: todoStorage.fetch(),
        visibility: "all"
    },


    watch: {

        todos: {
            deep: true,

            handler: function (todos) {
                todoStorage.save(todos);
            }
        }

    },


    computed: {

        filteredTodos: function () {

            return filters[this.visibility](
                this.todos
            );

        }

    },


    methods: {

        /* -------------------------
           Add Todo
        ------------------------- */

        addTodo: function (event) {

            event.preventDefault();

            const text = this.inputVal.trim();

            if (!text) {
                return;
            }

            this.todos.push({

                id:
                    Date.now().toString() +
                    Math.random()
                        .toString(36)
                        .substring(2),

                text: text,

                complete: false

            });

            this.inputVal = "";

        },


        /* -------------------------
           Toggle Todo
        ------------------------- */

        toggleTodo: function (todo) {

            todo.complete = !todo.complete;

        },


        /* -------------------------
           Change Filter
        ------------------------- */

        filterTodos: function (filter) {

            this.visibility = filter;

        },


        /* -------------------------
           Delete Todo
        ------------------------- */

        deleteTodo: function (todo) {

            const index = this.todos.indexOf(todo);

            if (index !== -1) {

                this.todos.splice(index, 1);

            }

        }

    }

});