import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.selectById('tasks', id)
      if (!task) {
        return res.writeHead(405).end()
      }
      return res.end(JSON.stringify(task))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      if (!title || !description) {
        return res.writeHead(405).end(JSON.stringify({ message: 'Title e description são obrigatórios' }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
      database.insert('tasks', task)
      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.selectById('tasks', id)
      if (task) {
        database.delete('tasks', id)
        return res.writeHead(204).end()
      }
      return res.writeHead(405).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      const task = database.selectById('tasks', id)
      if (!task) {
        return res.writeHead(405).end(JSON.stringify({ message: 'Task não identificada' }))
      }
      database.update('tasks', id, {
        ...task,
        title,
        description,
        updated_at: new Date()
      })
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.selectById('tasks', id)
      if (task && task.completed_at !== null) {
        return res.writeHead(405).end()
      }

      database.updateCompletedAt('tasks', id, {
        ...task,
        completed_at: new Date(),
        updated_at: new Date()
      })
      return res.writeHead(204).end()
    }
  }
]
