import express from "express";

import { getAllUsers } from "../controller/usersController";


export default (router: express.Router) => {
  router.get("/users", getAllUsers);
};
