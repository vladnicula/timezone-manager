import test from 'ava';
import supertest from 'supertest-as-promised';

import serverSetup from '../../server/setup';
import * as config from '../../server/config';

import { SUPER_ADMIN, NORMAL_USER, MANAGER_USER } from '../../server/setup/fixtures/Users';
import { createUserAndGetId, authUserAndGetToken, getUserDetails } from './utils';

// TODO only run fixtures once for all test cases (in all files)
let server;
test.before('api server startup', async (t) => {
  const expressServer = await serverSetup({ ...config, FIXTURES_ENABLED: false });
  server = supertest(expressServer);
  t.pass();
});

let userId;
let userAuthToken;
let managerId;
let managerAuthToken;
let adminAuthToken;

test.beforeEach('new user', async (t) => {
  try {
    userAuthToken = await authUserAndGetToken(server, NORMAL_USER);
    managerAuthToken = await authUserAndGetToken(server, MANAGER_USER);
    adminAuthToken = await authUserAndGetToken(server, SUPER_ADMIN);

    userId = await getUserDetails(server, userAuthToken);
    managerId = await getUserDetails(server, managerAuthToken);
    userId = userId._id;
    managerId = managerId._id;
  } catch (err) {
    t.fail(err);
  }
  t.pass();
});

test.serial('Anon GET /api/v1/timezone', async (t) => {
  try {
    await server
      .get('/api/v1/timezone')
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('User GET /api/v1/timezone', async (t) => {
  try {
    await server
      .get('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('Manager GET /api/v1/timezone', async (t) => {
  try {
    await server
      .get('/api/v1/timezone')
      .set('x-access-token', managerAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('Admin GET /api/v1/timezone', async (t) => {
  try {
    await server
      .get('/api/v1/timezone')
      .set('x-access-token', adminAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('Manager GET /api/v1/timezone/userId', async (t) => {
  try {
    await server
      .get(`/api/v1/timezone?user_id=${userId}`)
      .set('x-access-token', managerAuthToken)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('Admin GET /api/v1/timezone?userId', async (t) => {
  try {
    await server
      .get(`/api/v1/timezone?user_id=${userId}`)
      .set('x-access-token', adminAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('User GET /api/v1/timezone?userId', async (t) => {
  try {
    await server
      .get(`/api/v1/timezone?user_id=${managerId}`)
      .set('x-access-token', userAuthToken)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
