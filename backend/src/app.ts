import express from "express";
import shoppingItemsRouter from "./routes/shopping-items.router";
import { handleErrors } from "./middlewares/handle-errors.middleware";

const app = express();

app.use(express.json())

app.use('/shopping-items', shoppingItemsRouter)

app.use(handleErrors)

export default app;
