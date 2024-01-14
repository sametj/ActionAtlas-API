const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const todoSchema = require("./api/models/todoSchema");

async function connectToDB() {
  await mongoose.connect(
    "mongodb+srv://sametj:Jamtem1224tope@sametjdatabase.le1coke.mongodb.net/?retryWrites=true&w=majority"
  );
}
connectToDB();

app.use(cors());
app.use(express.json());

app.get("/todos", (req, res) => {
  res.status(200).send(todoSchema.find());
});

app.get("/todos/:day", (req, res) => {
  const day = req.params.day;
  todoSchema.find({ day: day }).then((todos) => {
    res.send(todos);
  });
});

app.get("/todos/filter/:tag", (req, res) => {
  const tag = req.params.tag;
  todoSchema.find({ tag: tag }).then((todos) => {
    res.send(todos);
  });
});

app.get("/todos/:day/:tag", (req, res) => {
  const day = req.params.day;
  const tag = req.params.tag;
  todoSchema.find({ day: day, tag: tag }).then((todos) => {
    res.send(todos);
  });
});

app.post("/todos/addtask", (req, res) => {
  const day = req.body.day;
  const newTodo = {
    id: `${Date.now()}`,
    task: req.body.task,
    day: req.body.day,
    tag: req.body.tag,
    completed: req.body.completed,
    dayAdded: `${Date.now()}`,
  };
  todoSchema.create(newTodo);
  res.status(201).send(newTodo);
});

app.delete("/todos/delete/:id", (req, res) => {
  const id = req.params.id;
  todoSchema.deleteOne({ id: id }).then(() => {
    res.send({});
  });
});

app.delete("/todos/deleteStored", (req, res) => {
  todoSchema.deleteMany().then(() => {
    res.send("Deleted all todos");
  });
});

app.put("/todos/edit/:id", (req, res) => {
  const id = req.params.id;
  todoSchema.updateOne({ id }, req.body).then(() => {
    todoSchema.find({ id: id }).then((todos) => {
      res.send(todos);
    });
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000");
});
