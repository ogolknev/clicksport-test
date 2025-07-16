import request from "supertest";
import app from "../../src/app";

describe("ShoppingItems API", () => {
  describe("create", () => {
    it("should return 200 and created item", async () => {
      const res = await request(app)
        .post("/shopping-items")
        .send({ name: "item", price: 10 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");

      await request(app).delete(`/shopping-items/${res.body.data.id}`);
    });
  });

  describe("get", () => {
    it("should return 200 and 1 page of items", async () => {
      const res = await request(app).get("/shopping-items");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });

  describe("getOne", () => {
    it("should return 200 and item", async () => {
      const resCreate = await request(app)
        .post("/shopping-items")
        .send({ name: "item", price: 10 });

      const res = await request(app).get(
        `/shopping-items/${resCreate.body.data.id}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");

      await request(app).delete(`/shopping-items/${resCreate.body.data.id}`);
    });
  });

  describe("delete", () => {
    it("should return 204", async () => {
      const resCreate = await request(app)
        .post("/shopping-items")
        .send({ name: "item", price: 10 });

      const res = await request(app).delete(
        `/shopping-items/${resCreate.body.data.id}`
      );

      console.log({status: res.status})

      expect(res.status).toBe(204);
    });
  });
});
