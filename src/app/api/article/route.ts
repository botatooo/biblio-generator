import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";
import { resolvePDFJS } from "pdfjs-serverless";

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
    const urlObject = new URL(url);

    if (urlObject.pathname.endsWith(".pdf")) {
      const { getDocument } = await resolvePDFJS();

      const pdfBytes = await fetch(url).then((res) => res.arrayBuffer());

      let pdf;
      try {
        pdf = await getDocument(pdfBytes).promise;
      } catch (error) {
        console.error("Failed to parse PDF", url, error);
        return {
          success: false,
          url,
        } as const;
      }
      
      const metadata = await pdf.getMetadata();
      let {Author, Title} = metadata.info as Record<string, string | undefined>;

      console.log(Author, Title);

      if (!Title) {
        Title = urlObject.pathname.split("/").pop()
          ?.replace(".pdf", "")
          ?.replaceAll(/[-_]/g, " ");
      }

      return {
        success: true,
        author: Author || "",
        siteName: urlObject.hostname.replace("www.", ""),
        title: Title || "",
        url,
      };
    }

    let dom: JSDOM;
    try {
      dom = await JSDOM.fromURL(url, {
        userAgent: request.headers.get("user-agent") || "",
      });
    } catch (error) {
      console.error("Failed to parse HTML", url, error);
      return {
        success: false,
        url,
      } as const;
    }

    if (["www.youtube.com", "youtube.com", "youtu.be"].includes(urlObject.hostname)) {
      const res = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
      if (!res.ok) {
        console.error("Failed to get YouTube video", url);
        return {
          success: false,
          url,
        } as const;
      };

      const data = await res.json();
      const title = data.title;
      const author = data.author_name;

      return {
        success: true,
        author: author,
        siteName: urlObject.hostname.replace("www.", ""),
        title: title,
        url,
      };
    }

    const readabilityData = new Readability(dom.window.document).parse();
    if (readabilityData) {
      return {
        success: true,
        author: readabilityData.byline?.trim(),
        siteName: readabilityData.siteName,
        title: readabilityData.title,
        url,
      };
    }

    console.error("Failed to parse article", url);
    return {
      success: false,
      url,
    } as const;
  }));

  const biblios = articles
    .map((article) => ({
      success: article.success,
      content: article.success
        ? resolve_url_to_biblio(article)
        : article.url,
    }));

  return jsonResponse(biblios);
}
