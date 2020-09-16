const express = require("express");
const mongoose = require("mongoose");
const port = process.env.NARASI_LISTEN_PORT;
const app = express();

process.on("uncaughtException", (err) => {
  console.log("UNHANDLER EXCEPTION! - Shutting down...");
  console.log(err.name, err.message);

  process.exit(1);
});

const DB = process.env.MONGO_INITDB_URI + process.env.MONGO_INITDB_NAME;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => console.log("DB connection successful!"));

const server = app.listen(port, () => {
  console.log(`We are running on port ${port}`);
});

app.get('/', (req, res)=>{
  res.send('hahah')
})

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLER REJECTION! - Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
