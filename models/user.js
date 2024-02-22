const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/todo")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const schema = new mongoose.Schema({
  name: String,
  task: Array,
});

const user_basic_schema = new mongoose.Schema({
  name: String,
  email: String,
  pass: String,
});

const usermodel = mongoose.model("todo", schema);
const userbasic = mongoose.model("basicinfo", user_basic_schema);
module.exports = { usermodel, userbasic };
