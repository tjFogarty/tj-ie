---
title: "Working with Claude and Images"
description: "Sending images to Claude for analysis."
date: 2025-06-11T10:20:00.000+01:00
permalink: "/working-with-claude-and-images/"
coverPreview: claude-images.png
cover: "https://tj.ie/assets/images/claude-images.png"
tags:
  - javascript
  - ai
layout: layouts/post.njk
---

Recently [I launched a tool](https://swatch.tj.ie) that creates a colour scheme from an image. One of the main things I worked on was how to provide an image to a service like Claude in a reasonable fashion.

I wanted an optimised image but didn’t want to keep it long-term. I only need it for analysis.

The optimised image reduces costs, and I didn’t want to keep the image because it’s not my business.

## Image Analysis

I've worked with [Cloudinary](https://cloudinary.com) before, so this was the first thing that came to mind. I could resize the image, get an accessible URL, and send that to Claude for analysis. When I no longer need the image, I delete it.

It all starts with sending a base64 encoded image to an endpoint, so the following was useful to convert the image from the form:

``` ts
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};
```

I’m using [Netlify Functions](https://www.netlify.com/platform/core/functions/) here. This is a pared-back version of what I ended up with. The full version has more try/catch, but it gets in the way of readability for the purposes of this post.

``` ts
import Anthropic from '@anthropic-ai/sdk';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async (request: Request) => {
  const contentType = request.headers.get('content-type');
  const body = await request.json();

  const base64Data = body.image.replace(/^data:image\/[a-z]+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'image',
          folder: 'swatch-temp',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1000, height: 1000, crop: 'limit' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(imageBuffer);
  });

  const imageUrl = (uploadResult as any).secure_url;
  const publicId = (uploadResult as any).public_id;

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const chatCompletion = await client.messages.create({
    model: process.env.MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Your analysis prompt...`,
          },
          {
            type: 'image',
            source: {
              type: 'url',
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });

  const analysisResult = chatCompletion.content[0].text;

  await cloudinary.uploader.destroy(publicId);

  return new Response(
    JSON.stringify({
      success: true,
      analysisResult,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    },
  );
};
```
