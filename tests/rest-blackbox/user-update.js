import test from 'ava';
import supertest from 'supertest-as-promised';
import config from 'config';

import serverSetup from '../../api-server/setup';
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


test.serial('Admin PATCH /api/v1/user', async (t) => {
  const newUser = {
    username: 'new-user-to-be-manager',
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

    await patchUser(server, newUserId, {
      role: 1,
    }, authToken);

    let response = await server
        .get(`/api/v1/user/${newUserId}`)
        .set('x-access-token', authToken)
        .expect('Content-Type', /json/)
        .expect(200);

    if (response.body.users[0].role !== 1) {
      t.fail('User role change by admin failed');
    }

    await patchUser(server, newUserId, {
      role: 2,
    }, authToken);

    response = await server
        .get(`/api/v1/user/${newUserId}`)
        .set('x-access-token', authToken)
        .expect('Content-Type', /json/)
        .expect(200);

    if (response.body.users[0].role !== 2) {
      t.fail('User role change by admin failed expected role=2');
    }


    await patchUser(server, newUserId, {
      role: 0,
    }, authToken);

    response = await server
        .get(`/api/v1/user/${newUserId}`)
        .set('x-access-token', authToken)
        .expect('Content-Type', /json/)
        .expect(200);

    if (response.body.users[0].role !== 0) {
      t.fail('User role change by admin failed expected role=0');
    }
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('Manager PATCH /api/v1/user', async (t) => {
  const newUser = {
    username: 'manager-user-01-patch-test',
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
      role: 1,
    }, adminAuthToken);

    await server
      .get(`/api/v1/user/${newUserId}`)
      .set('x-access-token', managerAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);

    // should not be able to upgrade to admin role
    await patchUser(server, newUserId,
      {
        role: 2,
      }, managerAuthToken, 400,
    );
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});


test.serial('Manager PATCH /api/v1/user tries to change admin role or details', async (t) => {
  const newUser = {
    username: 'manager-user-01-hacker',
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

    const adminIdResponse = await server
      .get('/api/v1/user/me')
      .set('x-access-token', adminAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);

    await patchUser(server, newUserId, {
      role: 1,
    }, adminAuthToken);

    // should not be able to upgrade to admin role
    await patchUser(server, adminIdResponse.body.users[0]._id,
      {
        role: 2,
      }, managerAuthToken, 400,
    );
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test('User PATCH /api/v1/user can update self but not role', async (t) => {
  const newUser = {
    username: 'user-01-patcher',
    password: '1234',
  };

  let newUserId;
  let userAuthToken;
  // create user and login
  try {
    newUserId = await createUserAndGetId(server, newUser);
    userAuthToken = await authUserAndGetToken(server, newUser);


    await patchUser(server, newUserId, {
      role: 1,
      password: '1234',
    }, userAuthToken, 400);

    await patchUser(server, newUserId, {
      username: 'user-01-patcher-2',
    }, userAuthToken, 400);

    await patchUser(server, newUserId, {
      username: 'user-01-patcher-2',
      password: '1234',
    }, userAuthToken);

    const result = await server
      .get(`/api/v1/user/${newUserId}`)
      .set('x-access-token', userAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);

    if (result.body.users[0].username !== 'user-01-patcher-2') {
      t.fail('simple patch faild');
    }
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});

test.serial('User PATCH /api/v1/user can update  password', async (t) => {
  const newUser = {
    username: 'user-change-password',
    password: '1234',
  };

  let newUserId;
  let userAuthToken;
  // create user and login
  try {
    newUserId = await createUserAndGetId(server, newUser);
    userAuthToken = await authUserAndGetToken(server, newUser);


    await patchUser(server, newUserId, {
      password: '1234',
      newPassword: '3456',
    }, userAuthToken);

    await patchUser(server, newUserId, {
      username: 'username-updated-01-password-change',
      password: '1234',
    }, userAuthToken, 400);

    await patchUser(server, newUserId, {
      username: 'username-updated-01-password-change',
      password: '3456',
    }, userAuthToken);

    const result = await server
      .get(`/api/v1/user/${newUserId}`)
      .set('x-access-token', userAuthToken)
      .expect('Content-Type', /json/)
      .expect(200);

    if (result.body.users[0].username !== 'username-updated-01-password-change') {
      t.fail('simple patch faild');
    }
  } catch (err) {
    t.fail(err);
  }

  t.pass();
});
