import test from 'ava';
import supertest from 'supertest-as-promised';

import serverSetup from '../../server/setup';
import * as config from '../../server/config';
import { SUPER_ADMIN } from '../../server/setup/fixtures/Users';

let server;
test.before('api server startup', async () => {
  const expressServer = await serverSetup({ ...config, FIXTURES_ENABLED: false });
  server = supertest(expressServer);
});

test.only('GET /api/v1/user (SuperAdmin login)', async (t) => {
  const adminPayload = {
    username: SUPER_ADMIN.username,
    password: '1234',
  };

  let authToken;

  try {
    const response = await server
      .post('/api/v1/user/authenticate')
      .send(adminPayload)
      .expect('Content-Type', /json/)
      .expect(200);

    authToken = response.body.token;
  } catch (err) {
    t.fail(err);
  }

  try {
    await server
      .get('/api/v1/user')
      .set('x-access-token', authToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail('Admin cannot get access to user list');
  }

  t.pass();
});
