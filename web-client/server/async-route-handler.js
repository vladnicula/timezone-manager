const asyncRouteHandler = asyncRoute => (req, res, next) => {
  const routePromise = asyncRoute(req, res, next);
  if (routePromise.catch) {
    routePromise.catch(err => (next(err)));
  }
};

export default asyncRouteHandler;
