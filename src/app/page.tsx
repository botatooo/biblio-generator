"use client";

import { resolve_url_to_biblio } from "@/helpers/resolver";
import { useEffect, useState } from "react";

export default function Home() {
  const onClick = () => {
    const input = document.querySelector(
      "input[name=url]"
    ) as HTMLInputElement | null;
    if (!input) return;

    addLink(input.value);
    input.value = "";
  };

  const [links, setLinks] = useState([] as string[]);
  const [biblio, setBiblio] = useState([] as string[]);

  const addLink = (link: string) => {
    if (!link.startsWith("http://") || !link.startsWith("https://")) {
      link = "https://" + link;
    }

    let url: URL;
    try {
      url = new URL(link);
    } catch {
      alert("L'url n'est pas valide!");
      return;
    }

    url.search = "";
    url.hash = "";
    setLinks([...links, url.toString()]);
  };

  useEffect(() => {
    const url = new URL("/api/article", location.href);
    links.forEach((link) => url.searchParams.append("url", link));

    fetch(url).then(async (res) => {
      const data: ArticleData[] = await res.json();
      if (!Array.isArray(data)) return;

      const localBiblio = data.map((article) => resolve_url_to_biblio(article));

      setBiblio(localBiblio);
    });
  }, [links]);

  return (
    <div className="grid lg:grid-cols-2 gap-8 w-full min-w-fit">
      <div>
        <div className="border border-neutral-300 rounded-md">
          <table className="w-full overflow-hidden">
            <thead>
              <tr className="rounded-t-md">
                <th className="text-center font-medium py-2">Liens</th>
              </tr>
            </thead>
            <tbody>
              {links.length > 0 ? (
                links.map((link, index) => (
                  <tr
                    key={index}
                    className="border-neutral-300 border-t even:bg-teal-100"
                  >
                    <td className="font-mono p-2">{link}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-neutral-300 border-t even:bg-teal-100">
                  <td className="font-mono p-2">
                    Ajoutez un lien pour commencer!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 border-neutral-300 border rounded-md">
          <input
            name="url"
            type="url"
            className="h-8 w-[calc(100%-5rem)] bg-none rounded-md"
          />
          <button
            onClick={onClick}
            className="bg-teal-300 h-8 w-20 p-1 border rounded-md hover:bg-teal-200 float-right"
          >
            Ajouter
          </button>
        </div>
      </div>
      <div className="border-neutral-300 rounded-md border p-4 max-w-full">
        <h2 className="text-center font-bold underline leading-relaxed">
          Bibliographie
        </h2>
        <ul className="pl-6 list-disc">
          {biblio.map((source, index) => (
            <li key={index} className="border-neutral-300">
              {source}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
