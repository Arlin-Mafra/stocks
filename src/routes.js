import { Router, urlencoded } from "express";
import multer from "multer";

import multerConfig from "./config/multer";

const routes = Router();

const upload = multer(multerConfig);

import UserController from "./app/controllers/UserController";
import AuthController from "./app/controllers/AuthController";
import CategoryController from "./app/controllers/CategoryController";
import ProductController from "./app/controllers/ProductController";
import AttachmentController from "./app/controllers/AttachmentController";

import AuthMiddleware from "./app/midllewares/auth";

routes.post("/users", UserController.store);
routes.post("/auth", AuthController.store);

routes.use(AuthMiddleware);

//users
routes.get("/users", UserController.index);
routes.get("/users/:id", UserController.show);
routes.put("/users/:id", UserController.update);

//categories
routes.get("/categories", CategoryController.index);
routes.get("/categories/:id", CategoryController.show);
routes.post("/categories", CategoryController.store);
routes.put("/categories/:id", CategoryController.update);
routes.delete("/categories/:id", CategoryController.delete);

//products
routes.get("/products", ProductController.index);
routes.get("/products/:id", ProductController.show);
routes.post("/products/:category_id", ProductController.store);
routes.put("/products/:id", ProductController.update);
routes.delete("/products/:id", ProductController.delete);
//attachment

routes.post("/attachments", upload.single("file"), AttachmentController.store);

export default routes;
