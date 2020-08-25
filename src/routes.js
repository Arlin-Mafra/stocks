import { Router } from "express";
import UserController from "./app/controllers/UserController";
import AuthController from "./app/controllers/AuthController";

import AuthMiddleware from "./app/midllewares/auth";

const routes = Router();

routes.post("/users", UserController.store);
routes.post("/auth", AuthController.store);

routes.use(AuthMiddleware);

routes.get("/users", UserController.index);
routes.get("/users/:id", UserController.show);
routes.put("/users/:id", UserController.update);

export default routes;
