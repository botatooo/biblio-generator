import { is_human_name } from "./nlp";

const get_domain_name = (url: string) => {
  const urlObject = new URL(url);
  const domainWithTld = urlObject.hostname.replace("www.", "");
  const domainParts = domainWithTld.split(".");

  if (domainParts.length === 2) {
    return domainParts[0];
  }

  // assume that the domain is in the format domain.tld.sld
  return domainParts[domainParts.length - 3];
};

const get_site_name = (siteName: string | undefined, url: string | undefined) => {
  // try to extract website name from title
  // for (const seperator of ["-", "—", "–", "|"]) {
  //   if (typeof title !== "undefined" && title.includes(seperator)) {
  //     const parts = title.split(seperator)
  //     const shortest_part = parts.sort((a, b) => a.length - b.length)[0]
  //     return shortest_part.trim()
  //   }
  // }

  if (siteName) {
    return siteName;
  }

  if (url) { // if not possible, extract from url (domain name)
    return get_domain_name(url);
  }

  return "[s.l.]"; // sans lieu
};

// export const format_title = (title: string | undefined) => {
//   if (!title) {
//     return "[s.t.]" // sans titre
//   }

//   for (const seperator of ["-", "—", "–", "|"]) {
//     if (title.includes(seperator)) {
//       const parts = title.split(seperator)
//       const longest_part = parts.sort((a, b) => b.length - a.length)[0]
//       return longest_part.trim()
//     }
//   }

//   return title.trim()
// }


export const format_authors = (article: ArticleData) => {
  // Formats an array of authors into a string according to the rules specified in the 2023 - 2024 edition of Montreal International School's "Guide de présentation des travaux écrits".

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
    const [first, ...last] = author.split(" ");
    return last.join(" ").toUpperCase() + ", " + first;
  }

  // if the first author is an organization, format it as "ORGANIZATION"
  return author.toUpperCase();
};