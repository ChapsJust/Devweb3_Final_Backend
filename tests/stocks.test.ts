import { describe, it, expect, beforeAll } from "vitest";
import { agent } from "./support/setup";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import Paths from "./common/Paths";

export interface StockResponse {
  message: string;
  stocks?: Array<{
    _id: string;
    stockName: string;
    stockShortName: string;
    quantity: number;
    unitPrice: number;
    isAvailable: boolean;
  }>;
  stock?: {
    _id: string;
    stockName: string;
    stockShortName: string;
    quantity: number;
    unitPrice: number;
    isAvailable: boolean;
  };
}

interface UserResponse {
  token?: string;
  user?: { _id: string };
}

describe("StockRoutes", () => {
  let authToken: string = "";
  let createdStockId: string = "";
  const timestamp = Date.now();
  const testUser = {
    name: "Stock Tester",
    email: `stocktest${timestamp}@example.com`,
    password: "password123",
    dateOfBirth: new Date("1990-01-01"),
    address: "123 Test Street",
  };

  // Se connecter avant les tests
  beforeAll(async () => {
    // 1. Créer l'utilisateur
    await agent.post(Paths.Users.Register).send({ user: testUser });

    // 2. Se connecter pour obtenir le token
    const loginRes = await agent.post(Paths.Users.Login).send({
      email: testUser.email,
      password: testUser.password,
    });

    if (loginRes.status === HttpStatusCodes.OK) {
      const body = loginRes.body as UserResponse;
      authToken = body.token || "";
    }

    console.log("Auth token obtained:", authToken ? "Yes" : "No");
  }, 30000);

  // GET tous les stocks
  describe(`GET ${Paths.Stocks.Get}`, () => {
    it("devrait retourner tous les stocks avec un code 200", async () => {
      const res = await agent.get(Paths.Stocks.Get);
      expect(res.status).toBe(HttpStatusCodes.OK);
      const body = res.body as StockResponse;
      expect(body).toHaveProperty("stocks");
      expect(Array.isArray(body.stocks)).toBe(true);
    }, 15000);
  });

  // GET un stock par ID
  describe(`GET ${Paths.Stocks.GetById}`, () => {
    it("devrait retourner 404 pour un id invalide", async () => {
      const res = await agent.get("/api/stock/000000000000000000000000");
      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    }, 15000);
  });

  // POST ajout de stock
  describe(`POST ${Paths.Stocks.Add}`, () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await agent.post(Paths.Stocks.Add).send({
        stock: { stockName: "Test" },
      });
      expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    }, 15000);

    it("devrait créer un nouveau stock avec un code 201", async () => {
      expect(authToken).not.toBe("");

      // stockShortName doit avoir max 5 caractères
      const newStock = {
        stockName: "Test Stock Company",
        stockShortName: "TSTK",
        quantity: 100,
        unitPrice: 50.0,
        isAvailable: true,
        tags: ["test"],
      };

      const res = await agent.post(Paths.Stocks.Add).set("Authorization", `Bearer ${authToken}`).send({ stock: newStock });

      console.log("Create stock response:", res.status);

      expect(res.status).toBe(HttpStatusCodes.CREATED);
      const body = res.body as StockResponse;
      expect(body).toHaveProperty("stock");

      // Sauvegarder l'ID pour le test de suppression
      if (body.stock) {
        createdStockId = body.stock._id;
      }
    }, 15000);

    it("devrait retourner 400 si des champs sont manquants", async () => {
      expect(authToken).not.toBe("");

      const res = await agent
        .post(Paths.Stocks.Add)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ stock: { stockName: "Incomplete" } });

      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
    }, 15000);
  });

  // PUT mise à jour de stock
  describe(`PUT ${Paths.Stocks.Update}`, () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await agent.put(Paths.Stocks.Update).send({
        stock: { _id: "000000000000000000000000", unitPrice: 100 },
      });
      expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    }, 15000);
  });

  // DELETE un stock
  describe(`DELETE ${Paths.Stocks.Delete}`, () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await agent.delete("/api/stock/delete/000000000000000000000000");
      expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    }, 15000);

    it("devrait supprimer un stock existant avec un code 200", async () => {
      expect(authToken).not.toBe("");
      expect(createdStockId).not.toBe("");

      const res = await agent.delete(`/api/stock/delete/${createdStockId}`).set("Authorization", `Bearer ${authToken}`);

      // Ton API retourne 200 pour une suppression réussie
      expect(res.status).toBe(HttpStatusCodes.OK);
    }, 15000);
  });
});
