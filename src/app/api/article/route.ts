import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";

import { resolve_url_to_biblio } from "@/helpers/resolver";

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

  const links = searchParams.getAll("url");
  if (!links || links.length === 0) {
    return jsonResponse({ error: "Missing url parameter" }, { status: 400 });
  }

  const articles = await Promise.all(links.map(async (url) => {
    const dom = await JSDOM.fromURL(url, {
      userAgent: request.headers.get("user-agent") || "",
    });
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

  const biblios = articles.map((article) => article ? resolve_url_to_biblio(article) : "").filter(Boolean);

  return jsonResponse(biblios);
}
