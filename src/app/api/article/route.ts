import { Readability } from '@mozilla/readability';
import { JSDOM } from "jsdom";
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
  const links = searchParams.getAll('url');
  if (!links || links.length === 0) {
    return jsonResponse({ error: 'Missing url parameter' }, { status: 400 });
  }

  const articles = await Promise.all(links.map(async (url) => {
    const dom = await JSDOM.fromURL(url);
    const data = new Readability(dom.window.document).parse();

    if (!data) {
      return null;
    }

    return {
      author: data.byline,
      siteName: data.siteName,
      title: data.title,
      url,
    };
  }));

  return jsonResponse(articles.filter(Boolean));
}