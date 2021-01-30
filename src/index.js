// ./src/index.js

// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");

const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const test = require("./routes/test");

// defining the Express app
const app = express();

const PORT = config.get("PORT") || 3000;

// DB connection config
const url = config.get("MONGODB_URI");

mongoose
  .connect(url, { useNewUrlParser: true })
  .then((conn) =>
    console.log(
      `Now connected to MongoDB: ${conn.connection.host}`
    )
  )
  .catch((err) => console.error("Something went wrong", err));

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// app.use('/api/test', test);
app.use("/api/test", test);

app.listen(PORT, () =>
  console.log(`Server listening on port: ${PORT}`)
);
