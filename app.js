const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userSchema = require("./api/models/userSchema");
const app = express();

const corsOptions = {
  origin: "https://action-atlas.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://action-atlas.vercel.app");
  next();
});

require("dotenv").config();

async function connectToDB() {
  await mongoose.connect(
    `mongodb+srv://sametj:${process.env.DATABASE_PASSWORD}@sametjdatabase.le1coke.mongodb.net/?retryWrites=true&w=majority`
  );
}
connectToDB();

app.get("/", (req, res) => {
  res.send({ message: "Welcome to the API" });
});

//get all user todos
app.get("/:id/todos", (req, res) => {
  const id = req.params.id;
  userSchema.find({ id: id }).then((user) => {
    res.send(user[0].todos);
  });
});

//get user todos by day
app.get("/:id/todos/:day", (req, res) => {
  const id = req.params.id;
  const day = req.params.day;
  userSchema.find({ id: id }).then((user) => {
    res.send(user[0].todos.filter((todo) => todo.day === day));
  });
});

//get user todos by tag
app.get("/:id/todos/:day/:tag", (req, res) => {
  const id = req.params.id;
  const tag = req.params.tag;
  const day = req.params.day;
  userSchema.find({ id: id }).then((user) => {
    res.send(
      user[0].todos.filter((todo) => todo.tag === tag && todo.day === day)
    );
  });
});

//creating user
app.post("/user/register", (req, res) => {
  userSchema.find({ email: req.body.email }).then((user) => {
    if (user == "" || user == null) {
      const newUser = new userSchema({
        id: `${Date.now()}`,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        todos: [],
      });
      newUser.save();
      userSchema.create(newUser);
      res.status(201).send({
        sucess: "Account created",
        user: newUser,
      });
    } else {
      res.send({ error: "User already exists" });
    }
  });
});

//login
app.post("/user/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  userSchema.find({ email: email }).then((user) => {
    if (user == "" || user == null) {
      res.send({ error: "User does not exist" });
    } else {
      user[0].validatePassword(password).then((result) => {
        if (result) {
          res.send(user[0]);
        } else {
          res.send({ error: "Wrong password" });
        }
      });
    }
  });
});

//add todo to user
app.put("/:id/addtodo", (req, res) => {
  const id = req.params.id;
  const newTodo = {
    id: `${Date.now()}`,
    task: req.body.task,
    day: req.body.day,
    tag: req.body.tag,
    completed: req.body.completed,
    dayAdded: `${Date.now()}`,
  };
  userSchema.updateOne({ id }, { $push: { todos: newTodo } }).then(() => {
    res.send(newTodo);
  });
});

//delete todo from user
app.delete("/:id/deletetodo/:todoId", (req, res) => {
  const id = req.params.id;
  const todoId = req.params.todoId;
  userSchema
    .updateOne({ id }, { $pull: { todos: { id: todoId } } })
    .then(() => {
      res.send({});
    });
});

//delete all todos from user
app.delete("/:id/deletetodos", (req, res) => {
  const id = req.params.id;
  userSchema.updateOne({ id }, { $set: { todos: [] } }).then(() => {
    res.send({});
  });
});

//edit todo from user
app.put("/:id/edittodo/:todoId", (req, res) => {
  const id = req.params.id;
  const todoId = req.params.todoId;
  userSchema
    .updateOne(
      { id, "todos.id": todoId },
      {
        $set: {
          "todos.$.task": req.body.task,
          "todos.$.day": req.body.day,
          "todos.$.tag": req.body.tag,
          "todos.$.completed": req.body.completed,
        },
      }
    )
    .then(() => {
      res.send({ todos: req.body });
    });
});

//verify email
app.put("/user/verifyemail", (req, res) => {
  const email = req.body.email;
  userSchema.find({ email: email }).then((user) => {
    if (user == "" || user == null) {
      res.send({ error: "User does not exist" });
    } else {
      res.send({ sucess: "Account Found" });
    }
  });
});

//forgot password
app.put("/user/resetpassword", (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.password;
  userSchema.find({ email: email }).then((user) => {
    user[0].password = newPassword;
    user[0].save();
    res.send({ sucess: "Password changed" });
  });
});

//get checked todos
app.get("/:id/:day/completed", (req, res) => {
  const id = req.params.id;
  const day = req.params.day;
  userSchema.find({ id: id }).then((user) => {
    res.send(
      user[0].todos.filter(
        (todo) => todo.day === day && todo.completed === true
      )
    );
  });
});
app.get("/:id/:day/pending", (req, res) => {
  const id = req.params.id;
  const day = req.params.day;
  userSchema.find({ id: id }).then((user) => {
    res.send(
      user[0].todos.filter(
        (todo) => todo.day === day && todo.completed === false
      )
    );
  });
});

app.put("/deletedb", (req, res) => {
  userSchema.deleteMany({}).then(() => {
    res.send({});
  });
});
//server
app.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000");
});

module.exports = app;
