// JavaScript source code
function TodoModel() {
	this.id=ko.computed(function(title){
		var i, random;
		var uuid = '';

		for (i = 0; i < 32; i++) {
			random = Math.random() * 16 | 0;
			if (i === 8 || i === 12 || i === 16 || i === 20) {
				uuid += '-';
			}
			uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
		}

		return uuid;
	});
	this.title = ko.observable(title);
	this.completed=ko.observable(false);
};

function App() {
	this.todos = ko.observableArray([]);

	this.addTodo = function (todo) {
		todos.push(new TodoModel(todo.title));
	};

	this.removeTodo = function (todo) {
		this.todos.remove(todo);
	};
};

ko.applyBindings(new App());
