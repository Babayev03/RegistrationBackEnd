const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const db = require("./config/db");
const registirationRouter = require("./routes/registirationRouter");
app.use(express.json());

db.connect();

app.use((req, res, next) => {
  console.log(req.url);
  if (
    req.url == "/registiration/update-password" ||
    req.url == "/registiration/register" ||
    req.url == "/registiration/login" ||
    req.url == "/registiration/forgot-password" ||
    req.url == "/registiration/confirm-email"
  ) {
    next();
  } else {
    console.log(req.headers.authorization);
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
      } catch (error) {
        res.json({ msg: "You don't have access..." });
      }
    } else {
      res.json({ msg: "You don't have access..." });
    }
  }
});

app.use("/user", userRouter);
app.use("/registiration", registirationRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
