import test from 'ava';
import supertest from 'supertest-as-promised';

import serverSetup from '../../api-server/setup';
import * as config from '../../api-server/config';
import { SUPER_ADMIN } from '../../api-server/setup/fixtures/Users';
import { createUserAndGetId, authUserAndGetToken, patchUser } from './utils';

let server;

const adminPayload = {
  username: SUPER_ADMIN.username,
  password: SUPER_ADMIN.rawPassword,
};

test.before('api server startup', async () => {
  const expressServer = await serverSetup({ ...config, FIXTURES_ENABLED: false });
  server = supertest(expressServer);
});


test.serial('Admin GET /api/v1/user', async (t) => {
  let adminAuthToken;
  // create user and login
  try {
    adminAuthToken = await authUserAndGetToken(server, adminPayload);

    await server
      .get('/api/v1/user/')
      .set('x-access-token', adminAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }


  t.pass();
});

test.serial('Manager GET /api/v1/user', async (t) => {
  const newUser = {
    username: 'manager-user-01',
    password: '1234',
  };

  let newUserId;
  let managerAuthToken;
  let adminAuthToken;
  // create user and login
  try {
    newUserId = await createUserAndGetId(server, newUser);
    managerAuthToken = await authUserAndGetToken(server, newUser);

    adminAuthToken = await authUserAndGetToken(server, adminPayload);

    await patchUser(server, newUserId, {
      ...newUser,
      role: 1,
    }, adminAuthToken);

    await server
      .get(`/api/v1/user/${newUserId}`)
      .set('x-access-token', managerAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);


    await server
      .get('/api/v1/user/')
      .set('x-access-token', managerAuthToken)
      .expect('Content-Type', /json/);
  } catch (err) {
    t.fail(err);
  }


  t.pass();
});

test.serial('User GET /api/v1/user', async (t) => {
  const newUser = {
    username: 'normal-user',
    password: '1234',
  };

  let newUserId;
  let authToken;
  // create user and login
  try {
    newUserId = await createUserAndGetId(server, newUser);
    authToken = await authUserAndGetToken(server, newUser);
  } catch (err) {
    t.fail(err);
  }


  // login with admin and delete created user
  try {
    await server
      .get('/api/v1/user')
      .set('x-access-token', authToken)
      .expect('Content-Type', /json/)
      .expect(403);

    await server
      .get(`/api/v1/user/${newUserId}`)
      .set('x-access-token', authToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
