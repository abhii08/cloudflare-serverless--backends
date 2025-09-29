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

# Cloudflare Workers Setup Guide

## 1. Create a new Worker project

```bash
npm create cloudflare@latest -- my-first-worker
```

### Setup Options

For setup, select the following options:

- **What would you like to start with?** → Choose `Hello World example`
- **Which template would you like to use?** → Choose `Worker only`
- **Which language do you want to use?** → Choose `JavaScript`
- **Do you want to use git for version control?** → Choose `Yes`
- **Do you want to deploy your application?** → Choose `No` (we will be making some changes before deploying)

### Navigate to Project

Now, you have a new project set up. Move into that project folder:

```bash
cd my-first-worker
```

### Project Structure

In your project directory, C3 will have generated the following:

- **wrangler.jsonc**: Your Wrangler configuration file
- **index.js** (in `/src`): A minimal 'Hello World!' Worker written in ES module syntax
- **package.json**: A minimal Node dependencies configuration file
- **package-lock.json**: Refer to [npm documentation on package-lock.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json)
- **node_modules**: Refer to [npm documentation on node_modules](https://docs.npmjs.com/cli/v9/configuring-npm/folders#node-modules)

## 2. Develop with Wrangler CLI

C3 installs Wrangler, the Workers command-line interface, in Workers projects by default. Wrangler lets you create, test, and deploy your Workers projects.

After you have created your first Worker, run the `wrangler dev` command in the project directory to start a local server for developing your Worker. This will allow you to preview your Worker locally during development.

```bash
npx wrangler dev
```

## 3. Write code

Find the `src/index.js` file. `index.js` will be populated with the code below:

### Original index.js

```javascript
export default {
  async fetch(request, env, ctx) {
    return new Response("Hello World!");
  },
};
```

## 4. Deploy your project

Deploy your Worker via Wrangler to a `*.workers.dev` subdomain or a Custom Domain.

```bash
npx wrangler deploy
```
