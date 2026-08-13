class Todo {
    constructor({
        title = "Todo App",
        data = [],
        onAdded = () => { },
        onDeleted = () => { },
        onStatusChanged = () => { }
    } = {}) {
        this.nodes = {};
        this.title = title;
        this.data = data;
        this.filteredData = data;
        this.count = data.length;

        this.addTask = this.addTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
        this.filterData = this.filterData.bind(this);

        this.onAdded = onAdded;
        this.onDeleted = onDeleted;
        this.onStatusChanged = onStatusChanged;

        this.filterTypes = [
            {
                name: "All",
                queryParam: null,
                queryValue: null,
                active: true
            },
            {
                name: "Active",
                queryParam: "completed",
                queryValue: false,
                active: false
            },
            {
                name: "Completed",
                queryParam: "completed",
                queryValue: true,
                active: false
            }
        ];

        this.elementDefaults = {
            type: "div",
            markup: "",
            container: document.body,
            attributes: {},
            events: {}
        };
    }


    /* =========================
       Element Creator
    ========================= */

    elementCreator(options) {
        const config = {
            ...this.elementDefaults,
            ...options
        };

        const elementNode = document.createElement(config.type);

        Object.keys(config.attributes).forEach(attribute => {
            if (config.attributes[attribute] !== null) {
                elementNode.setAttribute(
                    attribute,
                    config.attributes[attribute]
                );
            }
        });

        elementNode.innerHTML = config.markup;

        config.container.append(elementNode);

        Object.keys(config.events).forEach(event => {
            this.eventBinder(
                elementNode,
                event,
                config.events[event].action,
                config.events[event].api
            );
        });

        return elementNode;
    }


    /* =========================
       View Transition Helper
    ========================= */

    startTransition(callback) {
        if (document.startViewTransition) {
            document.startViewTransition(callback);
        } else {
            callback();
        }
    }


    /* =========================
       Update Task Count
    ========================= */

    updateCount() {
        this.count = this.data.length;

        this.nodes.count.innerHTML =
            this.count === 1
                ? "1 task"
                : `${this.count} tasks`;
    }


    /* =========================
       Event Binder
    ========================= */

    eventBinder(el, event, action, api = false) {
        el.addEventListener(event, e => {
            api ? action(e) : action();
        });
    }


    /* =========================
       Empty List
    ========================= */

    emptyListUI(message = "No tasks found") {
        this.nodes.list.innerHTML = "";

        this.nodes.emptyList = this.elementCreator({
            markup: message,

            attributes: {
                class: "task-empty"
            },

            container: this.nodes.list
        });
    }


    /* =========================
       Add Task
    ========================= */

    addTask({
        id = Date.now(),
        name = `New task #${Date.now()}`,
        completed = false
    } = {}) {

        const inputValue = this.nodes.input.value.trim();

        const taskName =
            inputValue.length > 0
                ? inputValue
                : name;

        const newTask = {
            id,
            name: taskName,
            completed
        };

        this.nodes.input.value = "";

        this.data.push(newTask);

        this.listUI(this.data);

        this.onAdded(newTask);

        this.updateCount();

        this.filterData();

        this.nodes.input.focus();
    }


    /* =========================
       Filter Tasks
    ========================= */

    filterData(e, param = null, value = null) {

        const attrParam = e
            ? e.target.getAttribute("data-param")
            : null;

        const attrValue = e
            ? e.target.getAttribute("data-value")
            : null;

        const queryParam =
            param !== null
                ? param
                : attrParam;

        const queryValue =
            value !== null
                ? String(value)
                : attrValue;


        this.filteredData =
            !queryValue && !queryParam
                ? this.data
                : this.data.filter(task => {
                    return String(task[queryParam]) === queryValue;
                });


        this.listUI(this.filteredData);


        const filterTypes = this.filterTypes.map(filter => {

            filter.active =
                String(filter.queryParam) === String(queryParam) &&
                String(filter.queryValue) === String(queryValue);

            return filter;

        });


        this.filterUI(filterTypes);

        this.filterTypes = filterTypes;
    }


    /* =========================
       Toggle Task Status
    ========================= */

    toggleStatus(e, id = null) {

        const taskId =
            id !== null
                ? id
                : Number(
                    e.target.getAttribute("data-id")
                );


        const updatedData = this.data.map(task => {

            if (task.id === taskId) {
                task.completed = !task.completed;
            }

            return task;

        });


        this.data = updatedData;

        this.onStatusChanged(taskId);

        this.updateCount();

        this.filterData();
    }


    /* =========================
       Delete Task
    ========================= */

    deleteTask(e, id = null) {

        const taskId =
            id !== null
                ? id
                : Number(
                    e.target.getAttribute("data-id")
                );


        const updatedData = this.data.filter(
            task => task.id !== taskId
        );


        this.data = updatedData;

        this.onDeleted(taskId);

        this.updateCount();

        this.filterData();
    }


    /* =========================
       Main UI
    ========================= */

    generalUI() {

        /* App */

        this.nodes.app = this.elementCreator({
            attributes: {
                class: "app"
            }
        });


        /* Header */

        this.nodes.header = this.elementCreator({
            attributes: {
                class: "task-header"
            },

            container: this.nodes.app
        });


        /* Title */

        this.nodes.title = this.elementCreator({
            type: "h1",

            markup: this.title,

            attributes: {
                class: "task-header-title"
            },

            container: this.nodes.header
        });


        /* Task List */

        this.nodes.list = this.elementCreator({
            attributes: {
                class: "task-list"
            },

            container: this.nodes.app
        });


        /* Footer */

        this.nodes.footer = this.elementCreator({
            type: "p",

            markup: "Made With ❤️ by K.Kl",

            attributes: {
                class: "made-by"
            },

            container: this.nodes.app
        });


        /* Tools */

        this.nodes.tools = this.elementCreator({
            attributes: {
                class: "task-tools"
            },

            container: this.nodes.header
        });


        /* Form */

        this.nodes.form = this.elementCreator({

            type: "form",

            attributes: {
                class: "task-form"
            },

            events: {
                submit: {
                    action: e => {
                        e.preventDefault();
                        this.addTask();
                    },

                    api: true
                }
            },

            container: this.nodes.header
        });


        /* Count */

        this.nodes.count = this.elementCreator({

            markup:
                this.count === 1
                    ? "1 task"
                    : `${this.count} tasks`,

            attributes: {
                class: "task-count"
            },

            container: this.nodes.tools
        });


        /* Filters */

        this.nodes.filters = this.elementCreator({

            attributes: {
                class: "task-filters"
            },

            container: this.nodes.tools
        });
    }


    /* =========================
       Form UI
    ========================= */

    formUI() {

        this.nodes.input = this.elementCreator({

            type: "input",

            attributes: {
                class: "task-input",
                placeholder: "Add a new task...",
                autofocus: "true",
                type: "text"
            },

            container: this.nodes.form
        });


        this.nodes.button = this.elementCreator({

            type: "button",

            markup: "Add Task",

            attributes: {
                class: "task-button",
                type: "submit"
            },

            events: {
                click: {
                    action: this.addTask,
                    api: false
                }
            },

            container: this.nodes.form
        });
    }


    /* =========================
       Filter UI
    ========================= */

    filterUI(filterTypes = this.filterTypes) {

        this.startTransition(() => {

            this.nodes.filters.innerHTML = "";

            filterTypes.forEach(type => {

                this.elementCreator({

                    type: "button",

                    markup: type.name,

                    attributes: {
                        class:
                            `task-filter${type.active ? " is-active" : ""}`,

                        "data-param":
                            type.queryParam !== undefined
                                ? type.queryParam
                                : null,

                        "data-value":
                            type.queryValue !== undefined
                                ? type.queryValue
                                : null,

                        type: "button"
                    },

                    events: {
                        click: {
                            action: this.filterData,
                            api: true
                        }
                    },

                    container: this.nodes.filters
                });

            });

        });
    }


    /* =========================
       Task List UI
    ========================= */

    listUI(data = this.data) {

        this.startTransition(() => {

            this.nodes.list.innerHTML = "";


            if (data.length === 0) {

                this.emptyListUI();

                return;

            }


            data.forEach(task => {

                /* Task Item */

                const item = this.elementCreator({

                    attributes: {

                        class:
                            `task-item${task.completed ? " is-completed" : ""}`

                    },

                    container: this.nodes.list
                });


                /* Checkbox */

                this.elementCreator({

                    type: "input",

                    attributes: {

                        class: "task-status",

                        type: "checkbox",

                        checked:
                            task.completed
                                ? "checked"
                                : null,

                        "data-id": task.id
                    },

                    events: {

                        change: {
                            action: this.toggleStatus,
                            api: true
                        }

                    },

                    container: item
                });


                /* Task Name */

                this.elementCreator({

                    type: "label",

                    markup: task.name,

                    attributes: {

                        class: "task-name"
                    },

                    container: item
                });


                /* Delete */

                this.elementCreator({

                    type: "button",

                    markup: "",

                    attributes: {

                        class: "task-delete",

                        "data-id": task.id,

                        type: "button",

                        "aria-label": `Delete ${task.name}`
                    },

                    events: {

                        click: {
                            action: this.deleteTask,
                            api: true
                        }

                    },

                    container: item
                });

            });

        });
    }


    /* =========================
       Initialize
    ========================= */

    init() {

        this.generalUI();

        this.formUI();

        this.listUI();

        this.filterUI();

        this.nodes.input.focus();

    }
}


/* =========================
   Starting Tasks
========================= */

const todoList = [

    {
        id: -1,
        name: "Morning walk",
        completed: true
    },

    {
        id: -2,
        name: "Meeting with Holden Caulfield",
        completed: true
    },

    {
        id: -3,
        name: "Call Alper Kamu",
        completed: false
    },

    {
        id: -4,
        name: "Book flight to Hungary",
        completed: false
    },

    {
        id: -5,
        name: "Blog about CSS box model",
        completed: true
    }

];


/* =========================
   Create Todo App
========================= */

const TodoApp = new Todo({

    title: new Date().toDateString(),

    data: todoList

});


/* =========================
   Initialize
========================= */

TodoApp.init();