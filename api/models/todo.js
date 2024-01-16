const path = "./data.json";
const fs = require("fs");

class Todo {
  getTodo() {
    return this.readData();
  }
  getTodoByTag(tag) {
    const todos = this.readData();
    const filteredTodos = todos.filter((todo) => todo.tag === tag);
    return filteredTodos;
  }
  getTodoByDay(day) {
    const todos = this.readData();
    const filteredTodos = todos.filter((todo) => todo.day === day);
    return filteredTodos;
  }

  getTodoByDayAndTag(day, tag) {
    const todos = this.readData();
    const filteredTodos = todos.filter(
      (todo) => todo.day === day && todo.tag === tag
    );
    return filteredTodos;
  }

  getTodoByID(id) {
    const todos = this.readData();
    const foundTodo = todos.find((todo) => todo.id === id);
    return foundTodo;
  }

  deleteTask(id) {
    const todos = this.readData();
    const deleteTodo = todos.filter((todo) => todo.id !== id);
    this.storeData(deleteTodo);
  }

  add(newTodo) {
    const currentTodos = this.readData();
    currentTodos.push(newTodo);
    this.storeData(currentTodos);
  }

  updateTask(id, updatedTodo) {
    const todos = this.readData();
    const foundTodo = todos.find((todo) => todo.id === id);
    if (foundTodo) {
      foundTodo.task = updatedTodo.task;
      foundTodo.completed = updatedTodo.completed;
      this.storeData(todos);
    }
  }

  readData() {
    let data = fs.readFileSync(path);
    return JSON.parse(data);
  }

  storeData(rawData) {
    let data = JSON.stringify(rawData);
    fs.writeFileSync(path, data);
  }
}

module.exports = Todo;
