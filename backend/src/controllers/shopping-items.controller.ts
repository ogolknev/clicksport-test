import { ShoppingItemsService } from "../services/shopping-items.service";
import { Request, Response } from "express";
import { APIResponse } from "../types/api-response";
import {
  ShoppingItem,
  ShoppingItemCreate,
  shoppingItemSchema,
} from "../models/shoping-item";
import { BadRequestError } from "../errors/BadRequestError";
import { ZodError } from "zod";

export class ShoppingItemsController {
  private service: ShoppingItemsService;

  async get(req: Request, res: Response) {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    const result = await this.service.get({
      page,
      pageSize,
    });

    const { items: data, ...pagination } = result;

    const response: APIResponse<ShoppingItem[]> = {
      data,
      meta: {
        pagination,
      },
    };

    res.json(response);
  }

  async getOne(req: Request, res: Response) {
    const id = Number(req.params.id);

    const result = await this.service.getOne(id);
    const response: APIResponse<ShoppingItem> = { data: result };

    res.json(response);
  }

  async create(req: Request, res: Response) {
    let body: ShoppingItemCreate;
    try {
      body = shoppingItemSchema.parse(req.body);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestError(
          err.issues.map((issue) => issue.message).join(", ")
        );
      }
      throw new BadRequestError();
    }

    const result = await this.service.create(body);
    const response: APIResponse<ShoppingItem> = { data: result };

    res.json(response);
  }

  async delete(req: Request) {
    const id = Number(req.params.id);

    await this.service.delete(id);
  }

  constructor(service: ShoppingItemsService) {
    this.service = service;
  }
}
