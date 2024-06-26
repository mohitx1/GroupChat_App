const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
// const fs = require("fs");

const cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const userRouter = require("./router/userRouter");
const homePageRouter = require("./router/homePageRouter");
const chatRouter = require("./router/chatRouter");
const groupRouter = require("./router/groupRouter");

//Models
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroup");


//Relationships between Tables

Chat.belongsTo(User);
Chat.belongsTo(Group);

User.hasMany(UserGroup);

Group.hasMany(Chat);
Group.hasMany(UserGroup);

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);


//Middleware
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/homePage", homePageRouter);
app.use("/chat", chatRouter);
app.use("/group", groupRouter);
app.get("*",(req,res)=>res.redirect('/'));

const port=process.env.PORT || 4000

sequelize
  .sync()
  .then((result) => {
    app.listen(port, () =>console.log(`server running on port: ${port}`));
  })
  .catch((err) => console.log(err));