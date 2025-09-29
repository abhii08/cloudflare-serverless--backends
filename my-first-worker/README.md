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