import express from 'express';

import asyncRouteHandler from '../../utils/async-route-handler';

import requireLogin from '../../middleware/require-login';
import controller from './controller';

export default function () {
  const timezoneApi = express.Router();

  /**
   * Get user list (manager and admin only)
   */
  timezoneApi.get(
    '/timezone',
    requireLogin,
    asyncRouteHandler(controller.listAll),
  );

  /**
   * Create a new timezone
   */
  timezoneApi.post(
    '/timezone',
    requireLogin,
    asyncRouteHandler(controller.create),
  );


  timezoneApi.patch(
    '/timezone/:id',
    requireLogin,
    asyncRouteHandler(controller.update),
  );

  return timezoneApi;
}
