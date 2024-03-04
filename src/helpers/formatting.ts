import { is_human_name } from "./nlp";

const get_domain_name = (link: string) => {
  const url = new URL(link);
  const domainParts = url.hostname.split(".");

  if (domainParts[1].length <= 3) {
    // amazon.co.uk
    // cssdm.gouv.qc.ca
    // google.com
    return domainParts[0];
  }

  // www.cbc.ca
  return domainParts[1];
};

const get_site_name = (siteName: string | undefined, url: string | undefined) => {
  if (siteName) {
    return siteName;
  }

  // if not possible, extract from url (domain name)
  if (url) {
    return get_domain_name(url).replaceAll(/-_/g, " ");
  }

  return "[s.l.]"; // sans lieu
};

export const format_title = (title: string | undefined) => {
  if (!title) {
    return "[s.t.]"; // sans titre
  }

  // if exported by office, remove the file extension
  title = title.replace(/\.(?:xls|ppt|doc)x?$/, "");

  title = title.trim();
  const hasPunctuation = title.endsWith(".") || title.endsWith("!") || title.endsWith("?");
  if (hasPunctuation) title = title.slice(0, -1);

  return title;
};


/**
 * Formats an array of authors into a string according to the rules specified in the 2023-2024 edition of Montreal International School's "Guide de présentation des travaux écrits".
 */
export const format_authors = (article: ArticleData) => {
  let author = article.author;
  const site = get_site_name(article.siteName, article.url);

  // if there are no authors, return the site name (which is also the organization name)
  if (!author) {
    return site.toUpperCase();
  }

  // just in case we catche the author's name wrong
  // if (author.toLowerCase().startsWith("par") || author.toLowerCase().startsWith("by")) {
  //   author = author.split(" ").slice(1).join(" ");
  // }

  // if the first author is a person, format it as "LAST, First"
  if (is_human_name(author)) {
    if (author.includes(",")) {
      const [last, first] = author.split(",");
      if (!last.trim() || !first.trim()) {
        return author.trim();
      }

      return last.trim().toUpperCase() + ", " + first.trim();
    }


    const author_parts = author.split(" ");
    if (author_parts[0] === author_parts[0].toUpperCase()) {
      let first = [];
      let last = [];
      for (const part of author_parts) {
        if (part === part.toUpperCase()) {
          last.push(part);
        } else {
          first.push(part);
        }
      }

      return last.join(" ") + ", " + first.join(" ");
    }

    const [first, ...last] = author_parts;
    return last.join(" ").toUpperCase() + ", " + first;
  }

  // if the first author is an organization, format it as "ORGANIZATION"
  return author.toUpperCase();
};
