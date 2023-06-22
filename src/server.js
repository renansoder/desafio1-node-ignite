import http from 'node:http'
import { routes } from './routes.js'
import { json } from './json.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req
  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })

  console.log('ROUTE', route)

  if (route) {
    const routeParams = req.url.match(route.path)
    const { ...params } = routeParams.groups
    req.params = params
    return route.handler(req, res)
  }
  return res.writeHead(404).end()
})

server.listen(3333)
