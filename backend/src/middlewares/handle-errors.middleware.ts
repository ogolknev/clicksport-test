import { Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function handleErrors(
  err: unknown,
  req: Request,
  res: Response,
) {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}