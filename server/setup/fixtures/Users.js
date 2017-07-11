/**
 * Development only fixtures for consistent testing and
 * developing of features.
 *
 * Should not be used in production.
 *
 * See https://www.npmjs.com/package/mongoose-fixtures for extending this
 * document with more complicated entities.
 */

const SUPER_ADMIN = { username: 'admin', rawPassword: '1234', password: '1234', role: 2 };

export { SUPER_ADMIN };

const NORMAL_USER = {
  username: 'johnny-user',
  password: '1234',
  role: 0,
};

export { NORMAL_USER };

const MANAGER_USER = {
  username: 'vlad-manager',
  password: '1234',
  role: 1,
};

export { MANAGER_USER };

const USERS = [SUPER_ADMIN, NORMAL_USER, MANAGER_USER];

export default USERS;
