const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const db = require("./config/db");
const registirationRouter = require("./routes/registirationRouter");
app.use(express.json());

db.connect();

app.use("/user", userRouter);
app.use("/registiration", registirationRouter)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
