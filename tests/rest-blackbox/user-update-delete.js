import test from 'ava';
import supertest from 'supertest-as-promised';

import serverSetup from '../../server/setup';
import * as config from '../../server/config';
import { SUPER_ADMIN } from '../../server/setup/fixtures/Users';

let server;

const adminPayload = {
  username: SUPER_ADMIN.username,
  password: SUPER_ADMIN.rawPassword,
};

test.before('api server startup', async () => {
  const expressServer = await serverSetup({ ...config, FIXTURES_ENABLED: false });
  server = supertest(expressServer);
});

const authUserAndGetToken = async (userPayload) => {
  const response = await server
    .post('/api/v1/user/authenticate')
    .send(userPayload)
    .expect('Content-Type', /json/)
    .expect(200);

  return response.body.token;
};

const createUserAndGetId = async (userPayload) => {
  const response = await server
      .post('/api/v1/user/')
      .send(userPayload)
      .expect('Content-Type', /json/)
      .expect(200);

  return response.body.user.id;
};

const patchUser = async (id, authToken, userPayload) => {
  const response = await server
    .post(`/api/v1/user/${id}`)
    .set('x-access-token', authToken)
    .send(userPayload)
    .expect('Content-Type', /json/)
    .expect(200);

  return response.body;
};

test.serial('GET /api/v1/user (SuperAdmin delete user)', async (t) => {
  const newUser = {
    username: 'new-user',
    password: '1234',
  };

  let newUserId;

  // create user and login
  try {
    newUserId = await createUserAndGetId(newUser);
    await authUserAndGetToken(newUser);
  } catch (err) {
    t.fail(err);
  }

  let authToken;

  // login with admin and delete created user
  try {
    authToken = await authUserAndGetToken(adminPayload);

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


test.serial('PATCH /api/v1/user (SuperAdmin upgrade user to manager/admin)', async (t) => {
  const newUser = {
    username: 'new-user-to-be-manager',
    password: '1234',
  };

  let newUserId;

  // create user and login
  try {
    newUserId = await createUserAndGetId(newUser);
    await authUserAndGetToken(newUser);
  } catch (err) {
    t.fail(err);
  }

  let authToken;

  // login with admin and delete created user
  try {
    authToken = await authUserAndGetToken(adminPayload);

    await server
      .patch(`/api/v1/user/${newUserId}`)
      .set('x-access-token', authToken)
      .send({
        ...newUser,
        role: 1,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    let response = await server
        .get(`/api/v1/user/${newUserId}`)
        .set('x-access-token', authToken)
        .expect('Content-Type', /json/)
        .expect(200);

    if (response.body.users[0].role !== 1) {
      t.fail('User role change by admin failed');
    }


    await server
      .patch(`/api/v1/user/${newUserId}`)
      .set('x-access-token', authToken)
      .send({
        ...newUser,
        role: 2,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    response = await server
        .get(`/api/v1/user/${newUserId}`)
        .set('x-access-token', authToken)
        .expect('Content-Type', /json/)
        .expect(200);

    if (response.body.users[0].role !== 2) {
      t.fail('User role change by admin failed');
    }


    await server
      .patch(`/api/v1/user/${newUserId}`)
      .set('x-access-token', authToken)
      .send({
        ...newUser,
        role: 0,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    response = await server
        .get(`/api/v1/user/${newUserId}`)
        .set('x-access-token', authToken)
        .expect('Content-Type', /json/)
        .expect(200);

    if (response.body.users[0].role !== 0) {
      t.fail('User role change by admin failed');
    }
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

