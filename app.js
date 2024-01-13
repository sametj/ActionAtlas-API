const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./api/models/todo");
const todoSchema = require("./api/models/todoSchema");
const todo = new Todo();

async function connectToDB() {
  await mongoose.connect(
    "mongodb+srv://sametj:Jamtem1224tope@sametjdatabase.le1coke.mongodb.net/?retryWrites=true&w=majority"
  );
}
connectToDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(todo.getTodo());
});

app.get("/todos", (req, res) => {
  res.status(200).send(todo.getTodo());
});

app.get("/todos/:day", (req, res) => {
  const day = req.params.day;
  const foundTodo = todo.getTodoByDay(day);
  if (foundTodo) {
    res.status(200).send(foundTodo);
  } else {
    res.status(404).send("Not Found");
  }
});

app.get("/todos/filter/:tag", (req, res) => {
  const tag = req.params.tag;
  const foundTodo = todo.getTodoByTag(tag);
  if (foundTodo) {
    res.status(200).send(foundTodo);
  } else {
    res.status(404).send("Not Found");
  }
});

app.get("/todos/:day/:tag", (req, res) => {
  const day = req.params.day;
  const tag = req.params.tag;
  const foundTodo = todo.getTodoByDayAndTag(day, tag);
  if (foundTodo) {
    res.status(200).send(foundTodo);
  } else {
    res.status(404).send("Not Found");
  }
});

app.post("/todos/storeData", (req, res) => {
  let store = [todo.getTodo()];
  store.forEach((element) => {
    element.forEach((todo) => {
      todoSchema.create(todo);
    });
  });

  res.send(todoSchema.create(store));
});

app.post("/todos/addtask", (req, res) => {
  const newTodo = {
    id: `${Date.now()}`,
    task: req.body.task,
    day: req.body.day,
    tag: req.body.tag,
    completed: req.body.completed,
    dayAdded: `${Date.now()}`,
  };
  const addedTodo = todo.add(newTodo);
  res.status(201).send(todo.getTodoByDay(newTodo.day));
});

app.delete("/todos/delete/:id", (req, res) => {
  const id = req.params.id;
  const foundTodo = todo.getTodoByID(id);
  if (foundTodo) {
    todo.deleteTask(id);
    res.status(200).send(todo.getTodoByDay(foundTodo.day));
  } else {
    res.status(404).send("Not Found");
  }
});

app.delete("/todos/deleteStored", (req, res) => {
  todoSchema.deleteMany().then(() => {
    res.send("Deleted");
  });
});

app.put("/todos/edit/:id", (req, res) => {
  const id = req.params.id;
  const foundTodo = todo.getTodoByID(id);
  if (foundTodo) {
    const updatedTodo = todo.updateTask(id, req.body);
    res.status(200).send(updatedTodo);
  } else {
    res.status(404).send("Not Found");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000");
});
