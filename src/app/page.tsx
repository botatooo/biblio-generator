"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { SpinnerCircular } from "spinners-react";

import { roboto_mono } from "@/app/fonts";

export default function Home() {
  const onClick = () => {
    const input = document.querySelector(
      "input[name=url]"
    ) as HTMLInputElement | null;
    if (!input) return;

    addLink(input.value);
    input.value = "";
  };

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState([] as { url: string; error: string }[]);
  const [links, setLinks] = useState([] as string[]);
  const [newestLink, setNewestLink] = useState("");
  const [biblio, setBiblio] = useState([] as string[]);

  const addLink = (link: string) => {
    if (!link.startsWith("http")) {
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
    setLinks((prev) => [...prev, url.toString()]);
    setNewestLink(url.toString());
  };

  useEffect(() => {
    if (!newestLink) return;

    const url = new URL("/api/article", location.href);
    url.searchParams.append("url", newestLink);

    setIsLoading(true);
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          setErrors((prev) => [
            { url: newestLink, error: res.statusText },
            ...prev,
          ]);
          console.error(res);
          setIsLoading(false);
        }

        const data: string[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) return;

        // const localBiblio = data.map((article) => resolve_url_to_biblio(article));

        setBiblio((prev) => [...prev, ...data]);
        setIsLoading(false);
      })
      .catch(console.error);
  }, [newestLink]);

  return (
    <div className="grid lg:grid-cols-2 gap-8 w-full min-w-fit">
      <div>
        <div className="border border-neutral-300 rounded-md">
          <table className="w-full overflow-hidden break-all">
            <thead>
              <tr className="rounded-t-md">
                <th className="text-center font-medium py-2">Liens</th>
              </tr>
            </thead>
            <tbody className={clsx(roboto_mono.variable, "font-mono")}>
              {links.length > 0 ? (
                links.map((link, index) => (
                  <tr
                    key={index}
                    className="border-neutral-300 border-t even:bg-teal-100"
                  >
                    <td className="p-2">{link}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-neutral-300 border-t even:bg-teal-100">
                  <td className="p-2">Ajoutez un lien pour commencer!</td>
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
          <SpinnerCircular
            enabled={isLoading}
            className="ml-2 inline-block"
            size={20}
            thickness={300}
            color="rgb(20 184 166)" // teal-500
            secondaryColor="transparent"
          />
        </h2>
        <ul className="pl-6 list-disc">
          {errors.map((error, index) => (
            <li key={index} className="text-red-400">
              {error.url}: {error.error}
            </li>
          ))}
          {biblio.map((source, index) => (
            <li key={index}>{source}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
