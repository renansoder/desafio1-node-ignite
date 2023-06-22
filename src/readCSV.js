import fs from 'node:fs'
import { parse } from 'csv-parse'
const databasePath = new URL('../pasta.csv', import.meta.url)

const file = fs.createReadStream(databasePath).pipe(parse({ delimiter: ',' }))
const result = (async function init() {
  for await (const row of file) {
    const [title, description] = row

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
})()
