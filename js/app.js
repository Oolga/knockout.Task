// JavaScript source code
function TodoModel(title,completed) {
	//this.id=ko.computed(function(){
	//	var i, random;
	//	var uuid = '';

	//	for (i = 0; i < 32; i++) {
	//		random = Math.random() * 16 | 0;
	//		if (i === 8 || i === 12 || i === 16 || i === 20) {
	//			uuid += '-';
	//		}
	//		uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
	//	}

	//	return uuid;
	//});
	this.title = ko.observable(title);
	this.completed=ko.observable(completed);
};

function App() {
	var self = this;

	//self.todos = ko.observableArray();

	self.renderTodos = ko.observableArray();

	self.todos = ko.observableArray(ko.utils.arrayMap(ko.utils.parseJson(window.localStorage.getItem("todos")), function (todo) {
		return new TodoModel(todo.title, todo.completed);
	}));

	self.current = ko.observable();

	self.comletedCount = ko.computed(function () {
		return ko.utils.arrayFilter(self.todos(), function (todo) {
			return todo.completed();
		}).length;
	},this);

	self.completedTodos = ko.computed(function () {
		return ko.utils.arrayFilter(self.todos(), function (todo) {
			return todo.completed();
		})
	});

	self.activeTodos=ko.computed(function () {
		return ko.utils.arrayFilter(self.todos(), function (todo) {
			return !todo.completed();
		})
	});

	self.activeCount = ko.computed(function () {
		return self.todos().length-self.comletedCount();
	},this);

	self.getText = function (count) {
		return ko.utils.unwrapObservable(count) === 1 ? ' item' : ' items';
	};

	self.addTodo = function () {
		var current = self.current().trim();

		self.todos.push(new TodoModel(current,false));
		self.current("");
	};

	self.removeTodo = function (todo) {
		self.todos.remove(todo);
	};

	self.toggleAll = ko.computed({
		read: function () {
			var todos = self.todos();
			for (var i = 0, l = todos.length; i < l; i++)
				if (!todos[i].completed()) return false;
			return true;
		},
		write: function (value) {
			ko.utils.arrayForEach(self.todos(), function (todo) {
				todo.completed(value);
			});
		}
	});

	self.removeCompleted = function () {
		self.todos.remove(function (todo) {
			return todo.completed();
		});
	};

	ko.computed(function () {
		// store a clean copy to local storage, which also creates a dependency
		// on the observableArray and all observables in each item
		window.localStorage.setItem("todos", ko.toJSON(self.todos));
	}).extend({
		rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
	}); // save at most twice per second

	self.renderActiveTodos = function () {
		self.renderTodos(self.activeTodos());
	};

	self.renderCompletedTodos = function () {
		self.renderTodos ( self.completedTodos());
	};

	self.renderAllTodos = function () {
		self.renderTodos =self.todos();
	};

	self.renderAllTodos();
};

ko.applyBindings(new App());
