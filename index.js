const express = require("express");
const session = require('express-session');
const passport = require("./config/auth");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoute");
const developerRoutes = require("./routes/developerRoutes");
const employeeRoutes=require("./routes/employeeRoutes")
const userRoutes = require("./routes/userRoutes");
const propertyRoutes=require('./routes/propertyRoute')
require("dotenv").config();
require('./config/auth');
const app = express();
app.use(express.json());
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.use(
    session({
      secret: "your_secret_key",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(authRoutes);

app.use("/users", userRoutes);
app.use("/employees", employeeRoutes);
app.use("/project", projectRoutes);
app.use("/developers", developerRoutes);
app.use("/properties", propertyRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
