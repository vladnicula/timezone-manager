import express from 'express';

import asyncRouteHandler from '../../utils/async-route-handler';

import requireLogin from '../../middleware/require-login';
import controller from './controller';

export default function () {
  const userApi = express.Router();

  /**
   * Get user list (manager and admin only)
   */
  userApi.get(
    '/user',
    requireLogin,
    asyncRouteHandler(controller.listAll),
  );

  /**
   * Get user details for an idividual user.
   * Will check if user can requiest info for that particular user
   */
  userApi.get(
    '/user/:id',
    requireLogin,
    asyncRouteHandler(controller.userDetails),
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
    requireLogin,
    asyncRouteHandler(controller.update),
  );

  userApi.delete(
    '/user/:id',
    requireLogin,
    asyncRouteHandler(controller.removeUser),
  );

  userApi.post(
    '/user/authenticate',
    asyncRouteHandler(controller.authenticate),
  );

  return userApi;
}
