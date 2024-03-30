"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { SpinnerCircular } from "spinners-react";

import { roboto_mono } from "@/app/fonts";
import { useCheckMobileScreen } from "@/helpers/hooks";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const [links, setLinks] = useState([] as string[]);
  const [biblio, setBiblio] = useState(
    [] as BiblioResult[]
  );
  const [initialized, setInitialized] = useState(false);

  const isMobile = useCheckMobileScreen(setInitialized);

  const addLinks = (links: string[]) => {
    for (const link of links) {
      try {
        new URL(link);
      } catch {
        alert("Un lien n'est pas valide!");
        return false;
      }
    }

    setLinks(links);
    return true;
  };

  const addLink = (link: string) => {
    return addLinks([link]);
  };

  useEffect(() => {
    if (!links.length) return;

    const url = new URL("/api/article", location.href);
    for (const link of links) {
      url.searchParams.append("url", link);
    }

    setIsLoading(true);
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          console.error(res);
          setIsLoading(false);
        }

        const data: BiblioResult[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) return;

        // https://stackoverflow.com/a/9645447/19456595
        setBiblio((prev) => [...prev, ...data].sort((a, b) => {
          if (!b.success) return -1;
          if (!a.success) return 1;

          return a.content.author.toLowerCase().localeCompare(b.content.author.toLowerCase());
        }));
        setIsLoading(false);
      })
      .catch(console.error);
  }, [links]);

  return (
    <div className="grid lg:grid-cols-2 gap-8 w-full max-w-full">
      {initialized ? (
        isMobile ? (
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
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();

                  if (addLink(e.currentTarget.value.trim())) {
                    e.currentTarget.value = "";
                  }
                }}
                className="h-8 w-[calc(100%-5rem)] bg-none rounded-md"
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as
                    | HTMLInputElement
                    | undefined;
                  if (!input) return;

                  if (addLink(input.value.trim())) {
                    input.value = "";
                  }
                }}
                className="bg-teal-300 h-8 w-20 p-1 border rounded-md hover:bg-teal-200 float-right"
              >
                Ajouter
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border border-neutral-300 rounded-md">
              <h1 className="text-center font-medium py-2">Liens</h1>
              <textarea
                name="urls"
                tabIndex={0}
                className="h-64 w-full border-t border-neutral-200"
              />
            </div>
            <button
              className="bg-teal-300 mt-2 py-1 px-2 border rounded-md hover:bg-teal-200 float-right"
              onClick={() => {
                const textarea = document.querySelector(
                  "textarea[name=urls]"
                ) as HTMLTextAreaElement | null;
                console.log(textarea, textarea?.value);
                if (!textarea) return;

                const urls = textarea.value
                  .split("\n")
                  .map((url) => url.trim())
                  .filter((url) => url !== "");

                if (addLinks(urls)) {
                  textarea.value = "";
                }
              }}
            >
              Ajouter les liens à la bibliographie
            </button>
          </div>
        )
      ) : (
        <div />
      )}
      <div className="block  border-neutral-300 rounded-md border p-4 max-w-full overflow-hidden break-words">
        <div className="font-['Times_New_Roman'] text-[12px]">
          <center>
            <strong>Bibliographie</strong>
            <SpinnerCircular
              enabled={isLoading}
              className="ml-2 inline-block"
              size={15}
              thickness={300}
              color="rgb(20 184 166)" // teal-500
              secondaryColor="transparent"
            />
          </center>
          <br />
          <strong>Document Internet</strong>
          <br />
          {biblio.map(({ success, content }, _index) => (
            <>
              {success === true ? (
                <span>
                  {content.author}. (Page consultée le {new Date().toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" })}).{" "}
                  <i>{content.title}</i>, [En ligne]. Adresse URL :{" "}
                  <a href={content.url} className="underline text-sky-700">
                    {content.url}
                  </a>
                </span>
              ) : (
                // </Markdown>
                <span className="text-red-500">{content}</span>
              )}
              <br />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
