/**
 * Wrapps any async route function into another function that
 * catchs any erros and sends them down the line to the
 * appropriate error handling route.
 *
 * Inspited by:
 * http://madole.xyz/error-handling-in-express-with-async-await-routes/
 *
 * @param {fn} asyncRoute - the async function to be wrapped
 */
const asyncRouteHandler = asyncRoute => (req, res, next) => {
  const routePromise = asyncRoute(req, res, next);
  if (routePromise.catch) {
    routePromise.catch(err => (next(err)));
  }
};

export default asyncRouteHandler;
