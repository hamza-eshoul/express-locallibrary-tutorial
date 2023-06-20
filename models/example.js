// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const someModelSchema = new Schema({
  a_string: String,
  a_date: Date,
});

// Compile model from schema

const SomeModel = mongoose.model("SomeModel", someModelSchema);

// Create a record
// // Create an instance of model SomeModel
// const awesome_instance = new SomeModel({ name: "awesome" });

// // Save the new model instance asychronously
// await awesome_instance.save();

// Create a model through the create method
// await someModel.create({ name: "also_awesome" });
