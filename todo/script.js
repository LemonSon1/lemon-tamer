const STORAGE_KEY = "kk-todo-app";

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

        // Load saved todos, otherwise use the default data
        this.data = this.loadData(data);

        this.filteredData = this.data;
        this.count = this.data.length;

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
       LocalStorage
    ========================= */

    loadData(defaultData) {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Could not load todos:", error);
        }

        return defaultData;
    }


    saveData() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(this.data)
            );
        } catch (error) {
            console.error("Could not save todos:", error);
        }
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
       View Transition
    ========================= */

    startTransition(callback) {
        if (document.startViewTransition) {
            document.startViewTransition(callback);
        } else {
            callback();
        }
    }


    /* =========================
       Count
    ========================= */

    updateCount() {
        this.count = this.data.length;

        this.nodes.count.innerHTML =
            this.count === 1
                ? "1 task"
                : `${this.count} tasks`;
    }


    /* =========================
       Events
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

        if (!inputValue) {
            return;
        }

        const newTask = {
            id,
            name: inputValue || name,
            completed
        };

        this.nodes.input.value = "";

        this.data.push(newTask);

        // SAVE
        this.saveData();

        this.listUI(this.data);

        this.onAdded(newTask);

        this.updateCount();

        this.filterData();

        this.nodes.input.focus();
    }


    /* =========================
       Filter
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
       Toggle Status
    ========================= */

    toggleStatus(e, id = null) {

        const taskId =
            id !== null
                ? id
                : Number(
                    e.target.getAttribute("data-id")
                );


        this.data = this.data.map(task => {

            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }

            return task;

        });


        // SAVE
        this.saveData();

        this.onStatusChanged(taskId);

        this.updateCount();

        this.filterData();
    }


    /* =========================
       Delete
    ========================= */

    deleteTask(e, id = null) {

        const taskId =
            id !== null
                ? id
                : Number(
                    e.target.getAttribute("data-id")
                );


        this.data = this.data.filter(
            task => task.id !== taskId
        );


        // SAVE
        this.saveData();

        this.onDeleted(taskId);

        this.updateCount();

        this.filterData();
    }


    /* =========================
       Main UI
    ========================= */

    generalUI() {

        this.nodes.app = this.elementCreator({
            attributes: {
                class: "app"
            }
        });


        this.nodes.header = this.elementCreator({
            attributes: {
                class: "task-header"
            },

            container: this.nodes.app
        });


        this.nodes.title = this.elementCreator({
            type: "h1",

            markup: this.title,

            attributes: {
                class: "task-header-title"
            },

            container: this.nodes.header
        });


        this.nodes.list = this.elementCreator({
            attributes: {
                class: "task-list"
            },

            container: this.nodes.app
        });


        /* Made With Footer */

        this.nodes.footer = this.elementCreator({
            type: "p",

            markup: "Made With ❤️ by K.Kl",

            attributes: {
                class: "made-by"
            },

            container: this.nodes.app
        });


        this.nodes.tools = this.elementCreator({
            attributes: {
                class: "task-tools"
            },

            container: this.nodes.header
        });


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


        this.nodes.filters = this.elementCreator({

            attributes: {
                class: "task-filters"
            },

            container: this.nodes.tools
        });
    }


    /* =========================
       Form
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

            container: this.nodes.form
        });
    }


    /* =========================
       Filters
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
       Task List
    ========================= */

    listUI(data = this.data) {

        this.startTransition(() => {

            this.nodes.list.innerHTML = "";


            if (data.length === 0) {
                this.emptyListUI();
                return;
            }


            data.forEach(task => {

                const item = this.elementCreator({

                    attributes: {
                        class:
                            `task-item${task.completed ? " is-completed" : ""}`
                    },

                    container: this.nodes.list
                });


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


                this.elementCreator({

                    type: "label",

                    markup: task.name,

                    attributes: {
                        class: "task-name"
                    },

                    container: item
                });


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
   Default Tasks
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
   Create App
========================= */

const TodoApp = new Todo({
    title: new Date().toDateString(),
    data: todoList
});


/* =========================
   Callbacks
========================= */

TodoApp.onAdded = task => {
    console.log("Added", task);
};

TodoApp.onDeleted = id => {
    console.log("Deleted, id:", id);
};

TodoApp.onStatusChanged = id => {
    console.log("Status changed, id:", id);
};


/* =========================
   Start
========================= */

TodoApp.init();