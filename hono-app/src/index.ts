import { Hono } from 'hono'

const app = new Hono()

//get
app.get('/', (c) => c.text('Hello Cloudflare Workers!'));

//post
app.post('/', async (c) => {
  const body = await c.req.json()
  console.log(body);
  console.log(c.req.header("Authorization"));
  console.log(c.req.query("param"));

  return c.text('Hello Hono!')
})

//middleware
async function authMiddleware(c:any, next:any) {
  if (c.req.header("Authorization")) {
    // Do validation
    await next()
  } else {
    return c.text("You dont have acces");
  }
};

app.get('/', authMiddleware, async (c) => {
  const body = await c.req.parseBody()
  console.log(body);
  console.log(c.req.header("Authorization"));
  console.log(c.req.query("param"));

  return c.json({msg: "as"})
})

export default app