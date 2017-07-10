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

const USERS = [SUPER_ADMIN];

export default USERS;
