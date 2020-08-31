const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URL;

mongoose.Promise = global.Promise;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose.connection.once("open", () =>
  console.log(`Connected to MongoDB Instance online!`)
);
