import express from "express";
import { ShoppingItemsController } from "../controllers/shopping-items.controller";
import { ShoppingItemsServiceDrizzle } from "../services/shopping-items.service";

const shoppingItemsRouter = express.Router();
const shoppingItemsController = new ShoppingItemsController(
  new ShoppingItemsServiceDrizzle()
);

shoppingItemsRouter
  .get("/", shoppingItemsController.get.bind(shoppingItemsController))
  .get("/:id", shoppingItemsController.getOne.bind(shoppingItemsController))
  .post("/", shoppingItemsController.create.bind(shoppingItemsController))
  .delete("/:id", shoppingItemsController.delete.bind(shoppingItemsController));

export default shoppingItemsRouter