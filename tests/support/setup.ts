import { beforeAll, afterAll } from "vitest";
import supertest, { Test } from "supertest";
import TestAgent from "supertest/lib/agent";
import mongoose from "mongoose";
import ENV from "@src/common/constants/ENV";

import app from "@src/server";

let agent: TestAgent<Test>;

beforeAll(async () => {
  // Connect to MongoDB before running tests
  await mongoose.connect(ENV.Mongodb);
  agent = supertest.agent(app);
});

afterAll(async () => {
  // Disconnect after tests complete
  await mongoose.disconnect();
});

export { agent };
