import test from 'ava';
import supertest from 'supertest-as-promised';
import config from 'config';

import serverSetup from '../../api-server/setup';

import { SUPER_ADMIN } from '../../api-server/setup/fixtures/Users';
import { createUserAndGetId, authUserAndGetToken, patchUser } from './utils';

// TODO only run fixtures once for all test cases (in all files)
let server;
test.before('api server startup', async (t) => {
  const expressServer = await serverSetup({ ...config, FIXTURES_ENABLED: false });
  server = supertest(expressServer);
  t.pass();
});

let userId;
let userAuthToken;
const userData = {
  username: 'timezone-create-test-user-for-delete',
  password: '1234',
};

const timezone1 = {
  name: 'timezone1',
  city: 'city1',
  offset: 0,
};

const timezone2 = {
  name: 'timezone2',
  city: 'city2',
  offset: -3.5,
};

let tz1Id;
let tz2Id;

let adminAuthToken;
const adminPayload = {
  username: SUPER_ADMIN.username,
  password: SUPER_ADMIN.rawPassword,
};

test.beforeEach('new user', async (t) => {
  try {
    userId = await createUserAndGetId(server, userData);
    userAuthToken = await authUserAndGetToken(server, userData);
    adminAuthToken = await authUserAndGetToken(server, adminPayload);
  } catch (err) {
    t.fail(err);
  }


  try {
    const tz1Response = await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send(timezone1)
      .expect('Content-Type', /json/)
      .expect(200);

    tz1Id = tz1Response.body.timezones[0]._id;

    const tz2Response = await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send(timezone2)
      .expect('Content-Type', /json/)
      .expect(200);

    tz2Id = tz2Response.body.timezones[0]._id;
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.afterEach('cleanup user', async (t) => {
  try {
    await server
      .delete(`/api/v1/user/${userId}`)
      .set('x-access-token', adminAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }
  t.pass();
});

test.serial('Anon DELETE /api/v1/timezone', async (t) => {
  try {
    await server
      .delete(`/api/v1/timezone/${tz1Id}`)
      .expect('Content-Type', /json/)
      .expect(400);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('User DELETE /api/v1/timezone', async (t) => {
  try {
    await server
      .delete(`/api/v1/timezone/${tz1Id}`)
      .set('x-access-token', userAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('Manager DELETE /api/v1/timezone', async (t) => {
  try {
    const managerUser = {
      username: 'new-manager-guy-for-delete',
      password: '1234',
    };
    const managerUserId = await createUserAndGetId(server, managerUser);

    await patchUser(server, managerUserId, {
      role: 1,
    }, adminAuthToken);

    const managerAuthToken = await authUserAndGetToken(server, managerUser);

    await server
      .delete(`/api/v1/timezone/${tz1Id}`)
      .set('x-access-token', managerAuthToken)
      .expect('Content-Type', /json/)
      .expect(400);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('Admin DELETE /api/v1/timezone', async (t) => {
  try {
    await server
      .delete(`/api/v1/timezone/${tz1Id}`)
      .set('x-access-token', adminAuthToken)
      .send({
        offset: 6,
      })
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
