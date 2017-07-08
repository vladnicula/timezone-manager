import test from 'ava';
import supertest from 'supertest-as-promised';

import serverSetup from '../../server/setup';
import * as config from '../../server/config';


let server;
test.before('api server startup', async () => {
  const expressServer = await serverSetup({ ...config, FIXTURES_ENABLED: false });
  server = supertest(expressServer);
});

test('GET /api/v1/user', async (t) => {
  try {
    await server
      .get('/api/v1/user')
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
