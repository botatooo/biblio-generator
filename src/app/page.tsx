"use client";

import type { ArticleData } from "@extractus/article-extractor";
import { resolve_url_to_biblio } from "@/helpers/resolver";
import { useEffect, useState } from "react";

export default function Home() {
  const onClick = () => {
    const input = document.querySelector(
      "input[name=url]"
    ) as HTMLInputElement | null;
    if (!input) return;

    try {
      new URL(input.value);
    } catch {
      alert("L'url n'est pas valide!");
      return;
    }

    setLinks([...links, input.value]);
    input.value = "";
  };

  const [links, setLinks] = useState([] as string[]);
  const [biblio, setBiblio] = useState([] as string[]);

  useEffect(() => {
    const url = new URL("/api/article", location.href);
    links.forEach((link) => url.searchParams.append("url", link));

    fetch(url).then(async (res) => {
      const data: ArticleData[] = await res.json();
      const localBiblio = data.map((article) => resolve_url_to_biblio(article));

      setBiblio(localBiblio);
    });
  }, [links]);

  return (
    <div className="grid grid-rows-2 lg:grid-cols-2 gap-8 w-full overflow-x-auto">
      <div className="border-neutral-300 rounded-md border p-4 max-w-full">
        <h2 className="text-center font-bold underline">Bibliographie</h2>
        <ul className="pl-6 list-disc">
          {biblio.map((source, index) => (
            <li key={index} className="border-neutral-300">
              {source}
            </li>
          ))}
        </ul>
      </div>
      <div className="truncate">
        <div className="border border-neutral-300 rounded-md">
          <h2 className="text-center font-medium py-2">Liens</h2>
          <table className="w-full overflow-hidden">
            {/* <thead>
              <tr className="border-neutral-300 border-b">
                <th className="text-left">Liens</th>
              </tr>
            </thead> */}
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
    </div>
  );
}
