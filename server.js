const app = require('./app')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false);

const { DB_HOST, PORT = 3000 } = process.env;


mongoose.connect(DB_HOST)
  .then(() => app.listen(PORT))
  .catch(error => {
    console.log(error.message);
    process.exit(1)
  })