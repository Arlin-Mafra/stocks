import { Router } from "express";
import multer from "multer";
import AttachmentController from "./app/controllers/AttachmentController";
import AuthController from "./app/controllers/AuthController";
import CategoryController from "./app/controllers/CategoryController";
import ClientController from "./app/controllers/ClientController";
import ProductController from "./app/controllers/ProductController";
import SaleController from "./app/controllers/SaleController";
import UserController from "./app/controllers/UserController";
import AuthMiddleware from "./app/midllewares/auth";
import multerConfig from "./config/multer";

const routes = Router();

const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/auth", AuthController.store);

routes.use(AuthMiddleware);

//attachment
routes.post("/attachments", upload.single("file"), AttachmentController.store);

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
routes.post("/products", ProductController.store);
routes.put("/products/:id", ProductController.update);
routes.delete("/products/:id", ProductController.delete);

//clients
routes.get("/clients", ClientController.index);
routes.get("/clients/:id", ClientController.show);
routes.post("/clients", ClientController.store);
routes.put("/clients/:id", ClientController.update);

//sales
routes.get("/sales", SaleController.index);
routes.get("/sales/:id", SaleController.show);
routes.post("/sales", SaleController.store);
routes.delete("/sales/:id", SaleController.delete);

export default routes;
