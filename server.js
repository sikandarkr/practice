const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { requireApiKey } = require("./middlewares/apiRequest");
const cors = require("cors");
const logger = require("morgan"); //Morgan is used for logging request details
const users = require("./route/users");
const path = require('path');
// const transaction = require("./routes/transaction");
const bodyParser = require("body-parser");
const mongoose = require("./config/database"); //database configuration
var jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
app.options("*", cors());
app.set("secretKey", "nodeRestApi"); // jwt secret token
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// connection to mongodb
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000
  })
);

//public route
app.use("/api/users",requireApiKey, users);
app.use("/api/chatting",requireApiKey, validateUser,users);
app.use("/api/search",requireApiKey, validateUser,users);

//private route
// app.use("/transaction", validateUser, transaction);
//app.use("/add", validateUser, skills);
function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function(
    err,
    decoded
  ) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      req.body.userId = decoded.id;
      next();
    }
  });
}
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// handle errors
app.use(function(err, req, res, next) {
  res.json({ error: "the error is" + err });

  if (err.status === 404) res.status(404).json({ message: "Not found" });
  else res.status(500).json({ message: "Something looks wrong :( !!!" });
});
app.listen(process.env.PORT, function() {
  console.log("Node server listening on port 3000");
});
