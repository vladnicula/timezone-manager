import express from 'express';

import asyncRouteHandler from '../../utils/async-route-handler';

import requireLogin from '../../middleware/require-login';
import controller from './controller';

export default function () {
  const userApi = express.Router();

  userApi.get(
    '/user',
    requireLogin,
    asyncRouteHandler(controller.listAll),
  );

  /**
   * Create a user
   */
  userApi.post(
    '/user',
    asyncRouteHandler(controller.register),
  );

  /*
   * Update existing user
   */
  userApi.patch(
    '/user/:id',
    asyncRouteHandler(controller.update),
  );

  userApi.delete(
    '/user/:id',
    asyncRouteHandler((req, res) => {
      res.json({
        status: 'ok',
      });
    }),
  );

  userApi.post(
    '/user/authenticate',
    asyncRouteHandler(controller.authenticate),
  );

  return userApi;
}
