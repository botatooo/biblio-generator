"use client";

export default function About() {
  return (
    <div className="m-auto">
      <div className="border border-neutral-300 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-3">À propos</h1>
        <p className="text-l">Generatrice de bibliographie</p>
        <p className="text-l">
          Version{" "}
          {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ? (
            <a
              href={`https://github.com/botatooo/biblio-generator/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
              className="text-blue-500 hover:underline"
            >
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.slice(0, 6)}
            </a>
          ) : (
            "inconnue"
          )}
        </p>
        <br />
        <p className="text-l">
          Auteur: Adnan-Aidan Taha &quot;botato&quot;{" "}
          <a href="https://github.com/botatooo" target="_blank">
            <img
              alt="GitHub"
              src="https://skillicons.dev/icons?i=github"
              loading="lazy"
              className="w-6 h-6 inline-block"
            />
          </a>
        </p>
        <p className="text-l">Contributeurs:</p>
        <ul className="text-l list-disc">
          <li className="ml-8">
            Bill Xu &quot;BX&quot;{" "}
            <a href="https://github.com/bx07" target="_blank">
              <img
                alt="GitHub"
                src="https://skillicons.dev/icons?i=github"
                loading="lazy"
                className="w-6 h-6 inline-block"
              />
            </a>
          </li>
        </ul>
        <br />
        <p className="text-l">
          Le code source est disponible sur{" "}
          <a
            href="https://github.com/botatooo/biblio-generator"
            className="text-blue-500 hover:underline"
          >
            <img
              alt=""
              src="https://skillicons.dev/icons?i=github"
              loading="lazy"
              className="w-4 h-4 mr-1 mb-1 inline-block text-center"
            />
            GitHub
          </a>
        </p>
        <p className="text-l">
          Ce site est hébergé sur{" "}
          <a
            href="https://vercel.com"
            className="text-blue-500 hover:underline"
          >
            <img
              alt=""
              src="https://skillicons.dev/icons?i=vercel"
              loading="lazy"
              className="w-4 h-4 mr-1 mb-1 inline-block text-center"
            />
            Vercel
          </a>
        </p>
        <p className="text-l">
          Icons fournis par{" "}
          <a
            href="https://skillicons.dev"
            className="text-blue-500 hover:underline"
          >
            <img
              alt=""
              src="https://skillicons.dev/favicon.png"
              loading="lazy"
              className="w-4 h-4 mr-1 mb-1 inline-block text-center rounded-sm"
            />
            Skill Icons
          </a>
        </p>
      </div>
    </div>
  );
}
