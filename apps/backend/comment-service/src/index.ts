import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import auth,{Variables} from '@repo/auth-config'
import { log } from 'console'

const app = new Hono<{Variables: Variables}>()

//@ts-ignore
app.use("*", auth.authSessionMiddleware)
app.get('/', (c) => {
  const user = c.get('user')
  log(user)
  return c.text('Hello Hono!')
})


const port = 8787
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
