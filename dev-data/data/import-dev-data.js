const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection is successful');
  });

// Read data

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// Import data to db

const importData = async () => {
  try {
    await Tour.create(tours);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log('data loaded success!!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// Delete data from db

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log('data deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// console.log(process.argv); // this gives an array where the node is locted locally // and the file we run through node.

if (process.argv[2] === '--import') {
  // We have to specify third element whether as --import or --delete in command line
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
