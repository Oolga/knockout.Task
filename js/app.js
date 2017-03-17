// JavaScript source code
function TodoModel(title,completed) {

	this.title = ko.observable(title);
	this.completed = ko.observable(completed);

};

function App() {
	var self = this;



	self.filter='all';

	self.todos = ko.observableArray(ko.utils.arrayMap(ko.utils.parseJson(window.localStorage.getItem("todos")), function (todo) {
		return new TodoModel(todo.title, todo.completed);
	}));

	self.renderTodos = ko.computed(function () { return self.todos();});



	self.current = ko.observable();

	self.comletedCount = ko.computed(function () {
		return ko.utils.arrayFilter(self.todos(), function (todo) {
			return todo.completed();
		}).length;
	}, this);

	self.completedTodos = ko.observableArray(ko.utils.arrayMap(self.todos().filter(function (todo) { return todo.completed();}), function (todo) {
		return new TodoModel(todo.title, todo.completed);
	}));


		/* ko.dependentObservable(function () {
		return ko.utils.arrayFilter(this.todos(), function (item) {
			return item.completed();
		});
	}, this);*/

	self.activeTodos = ko.dependentObservable(function () {
		return ko.utils.arrayFilter(this.todos(), function (item) {
			return !item.completed();
		});
	}, this);
	
	self.activeCount = ko.computed(function () {
		return self.todos().length - self.comletedCount();
	}, this);

	self.getText = function (count) {
		return ko.utils.unwrapObservable(count) === 1 ? ' item' : ' items';
	};

	self.addTodo = function () {
		var current = self.current().trim();
	
		if (self.filter !== 'completed')
			self.renderTodos.push(new TodoModel(current, false));

		if (self.filter!=="all")
		self.todos.push(new TodoModel(current, false));
		
		self.current("");
	};

	self.removeTodo = function (todo) {
		var t = todo;

		self.todos.remove(t);
		self.renderTodos.remove(t);
		
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

		self.renderTodos.remove(function (todo) {
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

		self.filter = "active";
	};

	self.renderCompletedTodos = function () {

		self.renderTodos=ko.computed(function(){return self.completedTodos();});
		self.filter = "completed";
	
	};

	self.renderAllTodos = function () {
		
		self.renderTodos(self.todos());
		self.filter = "all";
	};


}
ko.applyBindings(new App());
