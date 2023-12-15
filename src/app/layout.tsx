import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import type { Metadata } from "next";
import React from "react";

import { inter } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Generatrice de Bibliographie",
  // description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={clsx(
          inter.variable,
          "font-sans",
          "bg-neutral-100",
          "w-screen h-screen"
        )}
      >
        <div className="flex flex-col">
          <nav className="flex absolute flex-row items-center content-around flex-wrap text-white bg-teal-500 p-6 h-20 w-full">
            <h1 className="hidden sm:block font-semibold text-xl tracking-tight">
              Generatrice de Bibliographie
            </h1>
            <h1 className="sm:hidden font-semibold text-xl tracking-tight">
              Bibliographie
            </h1>
            <ol className="flex flex-row items-center content-center ml-auto list-none">
              <li className="pl-8">
                <a href="/">Accueil</a>
              </li>
              <li className="pl-8">
                <a href="/a-propos">À propos</a>
              </li>
            </ol>
          </nav>
          <main className="flex flex-col items-center justify-between px-12 md:px-20 lg:px-28 pt-28 pb-20">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
