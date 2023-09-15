import { format_authors } from "./formatting";

const date_options = { year: 'numeric', month: 'long', day: 'numeric' } as const;

export const resolve_url_to_biblio = (article: ArticleData) => {
  const author = format_authors(article);
  // const title = format_title(article.title)
  const today = new Date().toLocaleDateString('fr-CA', date_options);

  let title = article.title;
  if (!title.endsWith('.')) {
    title += ".";
  }

  return `${author}. (Page consultée le ${today}). ${article.title} [En ligne]. Adresse URL : ${article.url}.`
}