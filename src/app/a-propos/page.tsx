"use client";

export default function About() {
  return (
    <div className="m-auto">
      <div className="border border-neutral-300 rounded-2xl p-16">
        <h1 className="text-4xl font-bold text-center mb-5">À propos</h1>
        <p className="text-2xl">Generatrice de bibliographie</p>
        <p className="text-2xl">
          Version{" "}
          {process.env.VERCEL_GIT_COMMIT_SHA ? (
            <a
              href={`https://github.com/botatooo/biblio-generator/tree/${process.env.VERCEL_GIT_COMMIT_SHA}`}
            >
              {process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 5)}
            </a>
          ) : (
            "inconnue"
          )}
        </p>
        <br />
        <p className="text-2xl">
          Auteur: Adnan-Aidan Taha &quot;botato&quot;{" "}
          <a href="https://github.com/botatooo">
            <img
              alt="GitHub"
              src="https://skillicons.dev/icons?i=github"
              loading="lazy"
              className="w-8 h-8 inline-block"
            />
          </a>
          <a href="https://github.com/botatooo">
            <img
              alt="GitHub"
              src="https://skillicons.dev/icons?i=email"
              loading="lazy"
              className="w-8 h-8 inline-block"
            />
          </a>
        </p>
        <p className="text-2xl">
          Contributeurs:{" "}
          <ul>
            <li className="list-disc ml-8">
              Bill Xu &quot;BX&quot;
              <a href="https://github.com/bx07">
                <img
                  alt="GitHub"
                  src="https://skillicons.dev/icons?i=github"
                  loading="lazy"
                  className="w-8 h-8 ml-1 mb-1 inline-block"
                />
              </a>
            </li>
          </ul>
        </p>
        <br />
        <p className="text-2xl">
          Le code source est disponible sur{" "}
          <a
            href="https://github.com/botatooo/biblio-generator"
            className="text-blue-500 hover:underline"
          >
            <img
              alt=""
              src="https://skillicons.dev/icons?i=github"
              loading="lazy"
              className="w-6 h-6 mr-1 mb-1 inline-block text-center"
            />
            GitHub
          </a>
        </p>
        <p className="text-2xl">
          Ce site est hébergé sur{" "}
          <a
            href="https://vercel.com"
            className="text-blue-500 hover:underline"
          >
            <img
              alt=""
              src="https://skillicons.dev/icons?i=vercel"
              loading="lazy"
              className="w-6 h-6 mr-1 mb-1 inline-block text-center"
            />
            Vercel
          </a>
        </p>
      </div>
    </div>
  );
}
