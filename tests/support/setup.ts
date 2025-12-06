import { beforeAll } from 'vitest';
import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import app from '@src/server';

let agent: TestAgent<Test>;

beforeAll(() => {
  agent = supertest.agent(app);
});

export { agent };
