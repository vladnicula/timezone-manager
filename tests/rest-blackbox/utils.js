const authUserAndGetToken = async (server, userPayload) => {
  const response = await server
    .post('/api/v1/user/authenticate')
    .send(userPayload)
    .expect('Content-Type', /json/)
    .expect(200);

  return response.body.token;
};

export {
  authUserAndGetToken,
};

const createUserAndGetId = async (server, userPayload) => {
  const response = await server
      .post('/api/v1/user/')
      .send(userPayload)
      .expect('Content-Type', /json/)
      .expect(200);

  return response.body.user.id;
};

export {
  createUserAndGetId,
};

const patchUser = async (server, id, userPayload, authToken, custom = 200) => {
  const response = await server
    .patch(`/api/v1/user/${id}`)
    .set('x-access-token', authToken)
    .send(userPayload)
    .expect('Content-Type', /json/)
    .expect(custom);
  return response.body;
};

export {
  patchUser,
}
;
