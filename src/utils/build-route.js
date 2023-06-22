export function buildRoutePath(path) {
  const routeParametersReges = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersReges, '(?<id>[a-z0-9-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
  console.log('PATH:', pathRegex)
  return pathRegex
}
