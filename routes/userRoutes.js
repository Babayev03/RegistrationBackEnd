const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/get-all-users", userController.getAll);
userRouter.get("/get-user/:id", userController.getOne);

module.exports = userRouter;
