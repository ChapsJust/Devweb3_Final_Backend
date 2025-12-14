import { describe, it, expect } from "vitest";
import { agent } from "./support/setup";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import Paths from "./common/Paths";

export interface UserResponse {
  message: string;
  users?: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  user?: {
    _id: string;
    name: string;
    email: string;
    stocks?: Array<unknown>;
  };
  token?: string;
}

describe("UserRoutes", () => {
  // GET tous les utilisateurs
  describe(`GET ${Paths.Users.Get}`, () => {
    it("devrait retourner tous les utilisateurs avec un code 200", async () => {
      const res = await agent.get(Paths.Users.Get);
      expect(res.status).toBe(HttpStatusCodes.OK);
      const body = res.body as UserResponse;
      expect(body).toHaveProperty("users");
      expect(Array.isArray(body.users)).toBe(true);
    }, 15000);
  });

  // POST inscription
  describe(`POST ${Paths.Users.Register}`, () => {
    it("devrait créer un nouvel utilisateur avec un code 201", async () => {
      const newUser = {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "password123",
        dateOfBirth: new Date("1990-01-01"),
        address: "123 Test Street",
      };

      // Wrap user data in { user: ... } as expected by the endpoint
      const res = await agent.post(Paths.Users.Register).send({ user: newUser });
      expect(res.status).toBe(HttpStatusCodes.CREATED);
      const body = res.body as UserResponse;
      expect(body).toHaveProperty("user");
    }, 15000);

    it("devrait retourner 400 si des champs sont manquants", async () => {
      const res = await agent.post(Paths.Users.Register).send({ user: { email: "incomplete@test.com" } });
      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
    }, 15000);
  });

  // POST connexion
  describe(`POST ${Paths.Users.Login}`, () => {
    const testEmail = `logintest${Date.now()}@example.com`;
    const testUser = {
      name: "Login Test",
      email: testEmail,
      password: "password123",
      dateOfBirth: new Date("1990-01-01"),
      address: "123 Test Street",
    };

    it("devrait connecter un utilisateur existant avec un code 200", async () => {
      // D'abord créer l'utilisateur
      await agent.post(Paths.Users.Register).send({ user: testUser });

      // Puis se connecter
      const res = await agent.post(Paths.Users.Login).send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      const body = res.body as UserResponse;
      expect(body).toHaveProperty("token");
      expect(body).toHaveProperty("user");
    }, 15000);

    it("devrait retourner 401 avec un mauvais mot de passe", async () => {
      const res = await agent.post(Paths.Users.Login).send({
        email: testUser.email,
        password: "wrongpassword",
      });
      expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    }, 15000);

    it("devrait retourner 401 si l'utilisateur n'existe pas", async () => {
      const res = await agent.post(Paths.Users.Login).send({
        email: "nonexistent@test.com",
        password: "password123",
      });
      // The login returns UNAUTHORIZED (401) not NOT_FOUND (404)
      expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    }, 15000);
  });

  // GET un utilisateur par ID
  describe(`GET ${Paths.Users.GetOne}`, () => {
    it("devrait retourner 404 pour un id invalide", async () => {
      const res = await agent.get("/api/users/000000000000000000000000");
      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    }, 15000);
  });

  // DELETE un utilisateur (requires authentication)
  describe(`DELETE ${Paths.Users.Delete}`, () => {
    it("devrait retourner 401 sans authentification", async () => {
      const res = await agent.delete("/api/users/delete/000000000000000000000000");
      expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    }, 15000);
  });
});
