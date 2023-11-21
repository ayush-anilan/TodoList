const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db");
const TodoTask = require("./models/TodoTask");

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

connectDB();

// GET Method
app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find({});
    res.render("todo.ejs", { todoTasks: tasks });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// POST Method
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

//UPDATE
app
  .route("/edit/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const tasks = await TodoTask.find({});
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  })
  .post(async (req, res) => {
    try {
      const id = req.params.id;
      await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
      res.redirect("/");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
//DELETE
app.route("/remove/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    const result = await TodoTask.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Task not found");
    }
    res.redirect("/");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
app.listen(3000, () => console.log("Server Up and running"));
