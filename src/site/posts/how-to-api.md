---
title: "How To: Build and Deploy an API"
description: "How to build and deploy an API using Express, TypeScript and Fly.io"
date: 2025-09-24T19:22:00.000+01:00
permalink: "/how-to-api/"
coverPreview: how-to-api.png
cover: "https://tj.ie/assets/images/how-to-api.png"
layout: layouts/post.njk
---

I was working away on [Swatcher](https://swatcher.ie) a few weeks ago, and the server-side situation started to bother me.

I was using serverless functions, which really solved a lot of problems for me, but after a while, a few things started grabbing my attention. Like someone bouncing light at me from a watch face:

- Response times could be better due to cold starts
- Lots more front-end work required to try to optimise cache and implement optimistic updates to mitigate slower response times
- It didn’t feel portable
- Codebase started feeling too cluttered

I wasn’t enjoying writing code like this. It’s a hobby project, so I should use it as a testing ground for something like an external API. That could then feed other applications if I wanted to do something like a native application.

## Express

Tried and true, [Express](https://expressjs.com) was my choice. I’ve used it before, and I’m happy to use it again.

I’ve also opted for TypeScript this time around. It has become the default for everything I work on recently.

It’s a simple entry point of `/src/server.ts` which imports our app.

``` ts
import 'dotenv/config';
import app from './app';
import config from './config/index';

app.listen(config.port, async () => {
  console.log(`Server is running on port ${config.port}`);
});
```

Our `app.ts` is fairly typical:

``` ts
import compression from 'compression';
import express from 'express';
import type { Application } from 'express';

import corsMiddleware from './middleware/cors';
import apiRoutes from './routes/api';

const app: Application = express();

app.use(corsMiddleware);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

export default app;
```

`corsMiddleware` is a utility for managing who has access to the api:

``` ts
import cors from 'cors';
import type { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
			'http://localhost:3010'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
```

To run everything, we use `nodemon` and `tsx` like so in the package scripts:

``` json
"scripts": {
    "start": "tsx src/server.ts",
    "dev": "nodemon --exec tsx src/server.ts",
}
```

## Deployment

[Fly.io](https://fly.io) was chosen as it was very accessible to get going with. `fly launch` to add the application, and `fly deploy` from the CLI sent it out to the world. I also added Redis to my project to help with caching requests. This was another quick command to get going.

## Conclusion

It took a while to put together, and there are plenty of other interesting topics, such as cache warming and invalidation. I’ll write about those in the future when I’m sure I’ve done it correctly. That’s what this is for me, a lesson. It’s something new to sink my teeth into.

This is now a portable and scalable solution. I have one repository for the front-end, and another for the back-end, which includes all its services and LLM integrations. These can be moved around with some DNS changes if needed. Other projects can take advantage of this new api, such as native apps, or if I wanted to spin up a white-label project to expose only certain data. I’m excited.
