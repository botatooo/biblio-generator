/*
 * Copyright (c) 2023 Adnan-Aidan Taha
 */

import type { ArticleData } from "@extractus/article-extractor";
import { format_authors, format_title } from "./formatting";

const date_options = { year: 'numeric', month: 'long', day: 'numeric' } as const;


export const resolve_url_to_biblio = (article: ArticleData) => {
  const author = format_authors(article);
  const title = format_title(article.title)
  const today = new Date().toLocaleDateString('fr-CA', date_options);

  return `${author}. (Page consultée le ${today}). ${title}. [En ligne]. Adresse URL : ${article.url}.`
}