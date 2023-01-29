import UserController from "../Controllers/UserController";
import express from "express";
import requireAuth from "../Middlewares/requireAuth";
import isAdmin from "../Middlewares/isAdmin";

var router = express.Router();

const isAuth = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.post("/users", UserController.createUser);

router.get("/users", requireAuth, UserController.getUsers);

router.get("/users/:id", requireAuth, UserController.getUser);

router.put("/users/:id", requireAuth, isAdmin, UserController.updateUser);

router.delete("/users/:id", requireAuth, isAdmin, UserController.deleteUser);

router.post("/login", UserController.login);

router.post("/logout", requireAuth, UserController.logout);

router.get("/me", requireAuth, (req, res) => {
  const { password, ...user } = req.user;
  res.send(user);
});

export default router;
