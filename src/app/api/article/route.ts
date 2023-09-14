/*
 * Copyright (c) 2023 Adnan-Aidan Taha
 */

import { extract } from '@extractus/article-extractor';
import { NextResponse } from 'next/server';

// export const runtime = 'edge';

// const jsonResponse = (data: any, options: ResponseInit = { status: 200 }) => new Response(JSON.stringify(data), {
//   ...options,
//   headers: {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   },
// });

const jsonResponse = (data: any, options: ResponseInit = { status: 200 }) => NextResponse.json(data, options);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.getAll('url');
  if (!url) {
    return jsonResponse({ error: 'Missing url parameter' }, { status: 400 });
  }

  const articles = await Promise.all(url.map(async (url) => {
    const article = await extract(url, undefined, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0"
      }
    }).catch((err) => {
      console.error(err);
      return null;
    });
    return article;
  }));

  return jsonResponse(articles.map((article) => (
    article ? {
      author: article.author,
      title: article.title,
      url: article.url,
    } : null
  )));
}