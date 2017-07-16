import test from 'ava';
import supertest from 'supertest-as-promised';
import config from 'config';

import serverSetup from '../../api-server/setup';


import { SUPER_ADMIN } from '../../api-server/setup/fixtures/Users';

let server;
test.before('api server startup', async () => {
  const expressServer = await serverSetup({ ...config, FIXTURES_ENABLED: false });
  server = supertest(expressServer);
});

test.serial('GET /api/v1/user', async (t) => {
  try {
    await server
      .post('/api/v1/user/authenticate')
      .expect('Content-Type', /json/)
      .expect(400);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('GET /api/v1/user', async (t) => {
  try {
    await server
      .post('/api/v1/user/authenticate')
      .send(SUPER_ADMIN)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
