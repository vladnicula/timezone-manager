import test from 'ava';
import supertest from 'supertest-as-promised';

import serverSetup from '../../server/setup';
import * as config from '../../server/config';

// TODO only run fixtures once for all test cases (in all files)
let server;
test.before('api server startup', async () => {
  const expressServer = await serverSetup({ ...config, FIXTURES_ENABLED: false });
  server = supertest(expressServer);
});

test.serial('POST /api/v1/user (create new user) /api/v1/user/authenticate (login)', async (t) => {
  const payload = {
    username: 'vlad',
    password: '1234',
  };

  try {
    await server
        .post('/api/v1/user')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(200);

    await server
      .post('/api/v1/user/authenticate')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('POST /api/v1/user (create new user) no passs', async (t) => {
  const payload = {
    username: 'seconduser',
    password: '',
  };

  try {
    await server
      .post('/api/v1/user')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('POST /api/v1/user (create new user) invalid pass', async (t) => {
  const payload = {
    username: 'seconduser',
    password: '123',
  };

  try {
    await server
      .post('/api/v1/user')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('POST /api/v1/user (create new user) emtpy username', async (t) => {
  const payload = {
    username: '',
    password: '12345',
  };

  try {
    await server
      .post('/api/v1/user')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('POST /api/v1/user (create new user) invalid username', async (t) => {
  const payload = {
    username: 'jus',
    password: '12345',
  };

  try {
    await server
      .post('/api/v1/user')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(403);
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
