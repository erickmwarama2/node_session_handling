const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGO_DB_URI = "mongodb+srv://erickmwarama:mutwiriEM1992@max-nodejs-cluster.s8ko4.mongodb.net/shop?retryWrites=true&w=majority&appName=max-nodejs-cluster";

const app = express();
const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  collection: 'sessions'
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret hash key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  User.findById("671f33423aff1b343809e861")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    MONGO_DB_URI
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Erick",
          email: "erick@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
