import test from 'ava';
import supertest from 'supertest-as-promised';

import serverSetup from '../../server/setup';
import * as config from '../../server/config';
import { SUPER_ADMIN } from '../../server/setup/fixtures/Users';
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

test.serial('Admin DELETE /api/v1/user', async (t) => {
  const newUser = {
    username: 'new-user-to-be-deleted',
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
      .set('x-access-token', authToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('Manager DELETE /api/v1/user', async (t) => {
  const managerUser = {
    username: 'manager-to-delete-users',
    password: '1234',
  };

  const adminUser = {
    username: 'admin-for-deletion',
    password: '1234',
  };

  const normalUser = {
    username: 'normal-user-for-deletion',
    password: '1234',
  };


  let managerId;
  let managerAuth;
  let adminId;
  let userId;

  // create user and login
  try {
    managerId = await createUserAndGetId(server, managerUser);
    adminId = await createUserAndGetId(server, adminUser);
    userId = await createUserAndGetId(server, normalUser);
    managerAuth = await authUserAndGetToken(server, managerUser);
  } catch (err) {
    t.fail(err);
  }

  let adminAuthToken;

  // login with admin and delete created user
  try {
    adminAuthToken = await authUserAndGetToken(server, adminPayload);

    await patchUser(server, managerId, {
      role: 1,
    }, adminAuthToken);

    await patchUser(server, adminId, {
      role: 2,
    }, adminAuthToken);

    await server
      .delete(`/api/v1/user/${userId}`)
      .set('x-access-token', managerAuth)
      .expect('Content-Type', /json/)
      .expect(200);

    await server
      .delete(`/api/v1/user/${adminId}`)
      .set('x-access-token', managerAuth)
      .expect('Content-Type', /json/)
      .expect(403);

    await server
      .delete(`/api/v1/user/${managerId}`)
      .set('x-access-token', managerAuth)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('Simple user DELETE /api/v1/user', async (t) => {
  const normalUser = {
    username: 'normal-user-for-deletion',
    password: '1234',
  };

  try {
    const userId = await createUserAndGetId(server, normalUser);
    const userAuthToken = await authUserAndGetToken(server, normalUser);
    await server
      .delete(`/api/v1/user/${userId}`)
      .set('x-access-token', userAuthToken)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('Anon DELETE /api/v1/user', async (t) => {
  try {
    await server
      .delete('/api/v1/user/132131')
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
