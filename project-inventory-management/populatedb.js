#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Model = require("./models/model");
const Manufacturer = require("./models/manufacturer");
const Category = require("./models/category");
// const ModelInstance = require("./models/modelInstance");

const categories = [];
const manufacturers = [];
const models = [];
const modelInstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createManufacturers();
  await createModels();
  // await createModelInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function manufacturerCreate(index, name, country) {
  const manufacturerdetail = { name, country };

  const manufacturer = new Manufacturer(manufacturerdetail);

  await manufacturer.save();
  manufacturers[index] = manufacturer;
  console.log(`Added manufacturer: ${name} ${country}`);
}

async function modelCreate(
  index,
  manufacturer,
  name,
  year,
  description,
  price,
  category
) {
  const modeldetail = {
    manufacturer: manufacturer,
    name: name,
    year: year,
    description: description,
    price: price,
  };
  if (category != false) modeldetail.category = category;

  const model = new Model(modeldetail);
  await model.save();
  models[index] = model;
  console.log(`Added model: ${name}`);
}

async function modelInstanceCreate(index, model, description) {
  const modelinstancedetail = {
    model: model,
    description: description,
  };

  // const modelinstance = new ModelInstance(modelinstancedetail);
  // await modelinstance.save();
  // modelInstances[index] = modelinstance;
  // console.log(`Added model instance: ${model}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Saloon"),
    categoryCreate(1, "Estate"),
    categoryCreate(2, "GT"),
  ]);
}

async function createManufacturers() {
  console.log("Adding manufacturers");
  await Promise.all([
    manufacturerCreate(0, "Rover", "Britain"),
    manufacturerCreate(1, "BMW", "Germany"),
    manufacturerCreate(2, "Ford", "Ford Europe"),
    manufacturerCreate(3, "Jaguar", "Britain"),
  ]);
}
// index, manufacturer, name, year, description, price, category
async function createModels() {
  console.log("Adding models");
  await Promise.all([
    modelCreate(0, manufacturers[0], "SD1 Vitesse", 1985, "Red Saloon", 15, [
      categories[0],
    ]),
    modelCreate(1, manufacturers[0], "800 Vitesse", 1995, "Silver Saloon", 15, [
      categories[0],
    ]),
    modelCreate(2, manufacturers[1], "528i", 1998, "Blue Touring", 13, [
      categories[1],
    ]),
    modelCreate(
      3,
      manufacturers[3],
      "XJS",
      1988,
      "British racing green convertable",
      13,
      [categories[2]]
    ),
    modelCreate(4, manufacturers[2], "Mondeo", 1997, "Blue saloon", 14, [
      categories[0],
    ]),
  ]);
}

// index, model, description
// async function createModelInstances() {
//   console.log("Adding authors");
//   await Promise.all([
//     modelInstanceCreate(0, models[0], "Red"),
//     modelInstanceCreate(1, models[3], "Green convertable"),
//     modelInstanceCreate(2, models[1], "Blue Touring"),
//     modelInstanceCreate(3, models[2], "Blue Saloon"),
//     modelInstanceCreate(4, models[2], "Red Estate"),
//   ]);
// }
