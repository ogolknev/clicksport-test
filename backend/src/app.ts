import express from "express";
import shoppingItemsRouter from "./routes/shopping-items.router";

const app = express();

app.use(express.json())

app.use('/shopping-items', shoppingItemsRouter)

export default app;
