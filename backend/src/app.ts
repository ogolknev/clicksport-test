import express from "express";
import shoppingItemsRouter from "./routes/shopping-items.router";
import { handleErrors } from "./middlewares/handle-errors.middleware";
import cors from 'cors'

const app = express();

app.use(express.json())
app.use(cors());

app.use('/shopping-items', shoppingItemsRouter)

app.use(handleErrors)

export default app;
