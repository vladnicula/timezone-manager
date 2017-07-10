import test from 'ava';
import supertest from 'supertest-as-promised';

import serverSetup from '../../server/setup';
import * as config from '../../server/config';
import { SUPER_ADMIN } from '../../server/setup/fixtures/Users';
import { createUserAndGetId, authUserAndGetToken } from './utils';

let server;

const adminPayload = {
  username: SUPER_ADMIN.username,
  password: SUPER_ADMIN.rawPassword,
};

test.before('api server startup', async () => {
  const expressServer = await serverSetup({ ...config, FIXTURES_ENABLED: false });
  server = supertest(expressServer);
});

test.serial('Admin DELETE /api/v1/user', async (t) => {
  const newUser = {
    username: 'new-user',
    password: '1234',
  };

  let newUserId;

  // create user and login
  try {
    newUserId = await createUserAndGetId(server, newUser);
    await authUserAndGetToken(server, newUser);
  } catch (err) {
    t.fail(err);
  }

  let authToken;

  // login with admin and delete created user
  try {
    authToken = await authUserAndGetToken(server, adminPayload);

    await server
      .delete(`/api/v1/user/${newUserId}`)
      .expect('Content-Type', /json/)
      .expect(403);

    await server
      .delete(`/api/v1/user/${newUserId}`)
      .set('x-access-token', authToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
