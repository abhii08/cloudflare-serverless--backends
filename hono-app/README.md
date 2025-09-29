# Why Express Doesn't Work in Cloudflare Workers

The main reason Express doesn't work in Cloudflare Workers is because of the runtime environment:

## 1. Different Runtime

- Express is built for Node.js, which gives you access to APIs like `http`, `net`, `fs`, `streams`, etc.
- Cloudflare Workers run on V8 isolates (like a browser environment), not Node.js. They don't support Node's core modules (`http`, `fs`, etc.), so Express can't even bootstrap its server.

## 2. Request/Response Handling

- In Node.js, Express listens for requests using `http.createServer()`.
- In Workers, you don't run a server — Cloudflare handles that. Instead, you respond to fetch events with the Web Fetch API (`Request` and `Response` objects). Express isn't designed for that model.

## 3. Performance Model

- Workers are lightweight isolates with strict CPU and memory limits.
- Express depends on middleware patterns and abstractions optimized for long-running Node servers. That overhead doesn't fit well in Workers' short-lived execution model.

## Why We Use Hono

Hono is a lightweight web framework designed to work in multiple runtimes: Cloudflare Workers, Bun, Deno, Node.js.

- It's built on the Web Fetch API (request/response), not Node's `http` module.
- It has an Express-like syntax (`app.get('/', ...)`) so developers familiar with Express feel at home.
- It's small, fast, and edge-friendly, perfect for the Workers environment.

👉 **Think of Hono as "Express for Edge runtimes".**

# Working with Cloudflare Workers

## Initialize a New App
npm create hono@latest my-app

## Move to my-app and Install the Dependencies
cd my-app
npm i

## Hello World
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Cloudflare Workers!'))

export default app

## Getting Inputs from User
import { Hono } from 'hono'

const app = new Hono()

app.post('/', async (c) => {
  const body = await c.req.json()
  console.log(body);
  console.log(c.req.header("Authorization"));
  console.log(c.req.query("param"));

  return c.text('Hello Hono!')
})

export default app

💡 **More detail** - https://hono.dev/getting-started/cloudflare-workers

## Creating a simple auth middleware
import { Hono, Next } from 'hono'
import { Context } from 'hono/jsx';

const app = new Hono()

app.use(async (c, next) => {
  if (c.req.header("Authorization")) {
    // Do validation
    await next()
  } else {
    return c.text("You dont have acces");
  }
})

app.get('/', async (c) => {
  const body = await c.req.parseBody()
  console.log(body);
  console.log(c.req.header("Authorization"));
  console.log(c.req.query("param"));

  return c.json({msg: "as"})
})

export default app

💡**Notice** you have to return the c.text value

## Deploying
Make sure you're logged into Cloudflare (`wrangler login`)

npm run deploy

# Connecting to DB 
💡 https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare-workers
## Serverless environments have one big problem when dealing with databases. 
There can be many connections open to the DB since there can be multiple workers open in various regions
Prisma the library has dependencies that the cloudflare runtime doesn’t understand.

# Connection pooling in prisma for serverless env
💡
https://www.prisma.io/docs/accelerate
https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare-workers

1. Install prisma in your project
npm install --save-dev prisma

2. Init Prisma
npx prisma init

3. Create a basic schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       Int    @id @default(autoincrement())
  name     String
  email    String
	password String
}

4. Create migrations
npx prisma migrate dev --name init

5. Signup to Prisma accelerate
https://console.prisma.io/login

Enable accelerate
Generate an API key
Replace it in .env

6. Add accelerate as a dependency
npm install @prisma/extension-accelerate

7. Generate the prisma client
npx prisma generate --no-engine

8. Setup your code
import { Hono, Next } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'hono/adapter'

const app = new Hono()

app.post('/', async (c) => {
  // Todo add zod validation here
  const body: {
    name: string;
    email: string;
    password: string
  } = await c.req.json()
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)

  const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate())

  console.log(body)

  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password
    }
  })
  
  return c.json({msg: "as"})
})

export default app