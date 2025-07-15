import express from "express";
import shoppingItemsRouter from "./routes/shopping-items.router";

const app = express();
app.use('/shopping-items', shoppingItemsRouter)

export default app;
