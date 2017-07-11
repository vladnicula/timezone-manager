import test from 'ava';
import supertest from 'supertest-as-promised';

import serverSetup from '../../server/setup';
import * as config from '../../server/config';

import { SUPER_ADMIN } from '../../server/setup/fixtures/Users';
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
  username: 'timezone-create-test-user',
  password: '1234',
};

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

test.serial('Anon POST /api/v1/timezone (create new timezone)', async (t) => {
  const payload = {
    name: 'timezone name',
    city: 'timezone city name',
    offset: -3.5,
  };

  try {
    await server
      .post('/api/v1/timezone')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('User POST /api/v1/timezone (create new timezone)', async (t) => {
  const payload = {
    name: 'timezonename',
    city: 'london',
    offset: 0,
  };

  try {
    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('User POST /api/v1/timezone (create new timezone) invalid data', async (t) => {
  const payload = {
    name: 'seconduser',
    city: 'london',
    offset: 0,
  };

  try {
    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .expect('Content-Type', /json/)
      .expect(403);

    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send({ name: payload.name })
      .expect('Content-Type', /json/)
      .expect(403);

    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send({ city: payload.city })
      .expect('Content-Type', /json/)
      .expect(403);

    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send({ offset: payload.offset })
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('User POST /api/v1/timezone (create new timezone) same data', async (t) => {
  const payload = {
    name: 'seconduser',
    city: 'london',
    offset: 0,
  };

  try {
    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);

    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('User POST /api/v1/timezone (create new timezone) other user id targeted', async (t) => {
  const payload = {
    name: 'seconduser',
    city: 'london',
    offset: 0,
    userId: 'somethingelse',
  };

  try {
    payload.userId = await createUserAndGetId(server, {
      username: 'new-user-guy',
      password: '1234',
    });
    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('User POST /api/v1/timezone (create new timezone) invalid data', async (t) => {
  const validPayload = {
    name: 'name',
    city: 'london',
    offset: 1,
  };

  try {
    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send({
        ...validPayload,
        name: 'nam',
      })
      .expect('Content-Type', /json/)
      .expect(403);

    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send({
        ...validPayload,
        city: 'nam',
      })
      .expect('Content-Type', /json/)
      .expect(403);

    await server
      .post('/api/v1/timezone')
      .set('x-access-token', userAuthToken)
      .send({
        ...validPayload,
        offset: 'potato',
      })
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('Admin POST /api/v1/timezone (create new timezone) other user id targeted', async (t) => {
  const payload = {
    name: 'seconduser',
    city: 'london',
    offset: 0,
    userId,
  };

  try {
    await server
      .post('/api/v1/timezone')
      .set('x-access-token', adminAuthToken)
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('Manager POST /api/v1/timezone (create new timezone) other user id targeted', async (t) => {
  const payload = {
    name: 'seconduser',
    city: 'london',
    offset: 0,
    userId,
  };

  try {
    const managerUser = {
      username: 'new-manager-guy',
      password: '1234',
    };
    const managerUserId = await createUserAndGetId(server, managerUser);

    await patchUser(server, managerUserId, {
      role: 1,
    }, adminAuthToken);

    const managerAuthToken = await authUserAndGetToken(server, managerUser);

    await server
      .post('/api/v1/timezone')
      .set('x-access-token', managerAuthToken)
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
