import { format_authors, format_title } from "./formatting";

const date_options = { year: "numeric", month: "long", day: "numeric" } as const;

export const resolve_url_to_biblio = (article: ArticleData) => {
  const author = format_authors(article);
  const title = format_title(article.title);
  const today = new Date().toLocaleDateString("fr-CA", date_options);

  // const title = `<i>${articleTitle}</i>`;
  // const url = `<a href="${article.url}" class="text-sky-700 underline">${article.url}</a>`;

  return {
    author,
    title,
    today,
    url: article.url,
  };
};
