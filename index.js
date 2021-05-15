const app = require("./app");
const mongoose = require("mongoose");
const port = process.env.NARASI_APP_LISTEN_PORT;

process.on('uncaughtException', err => {
  console.log('UNHANDLER EXCEPTION! - Shutting down...');
  console.log(err.name, err.message);

  process.exit(1)
})

const DB = process.env.MONGO_INITDB_URI + process.env.MONGO_INITDB_NAME;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => console.log("DB connection successful!"))

const server = app.listen(port, () => {
  console.log(`We are running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! - Shutting down...');
  server.close(() => {
    process.exit(1)
  })
})