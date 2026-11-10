import type { Metadata } from "next";
import Link from "next/link";
import { localSplashUrl } from "@/lib/ddragon";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "Esta página afundou nas Águas de Sentina.",
  // why: Next.js already emits noindex for 404s; a canonical inherited from the home page
  // would tell crawlers this missing URL is a copy of "/".
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main className="lost">
      <div className="lost__bg" aria-hidden="true">
        <img src={localSplashUrl} alt="" />
      </div>
      <div className="lost__fog" aria-hidden="true" />
      <div className="lost__content">
        <img className="lost__crest" src="/images/bilgewater-crest.png" alt="" width={141} height={160} />
        <p className="lost__code" aria-hidden="true">
          404
        </p>
        <h1 className="lost__title">Esse alvo escapou do gancho</h1>
        <p className="lost__text">A página que você procurou afundou nas Águas de Sentina. Vamos voltar pra lane?</p>
        <div className="lost__actions">
          <Link className="btn btn--primary btn--pulse" href="/">
            Voltar para o início
          </Link>
          <Link className="link-subtle" href="/#picks">
            O que pickar comigo
          </Link>
        </div>
      </div>
    </main>
  );
}
