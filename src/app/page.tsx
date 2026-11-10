import { Counters } from "@/components/Counters";
import { Hero } from "@/components/Hero";
import { Kit } from "@/components/Kit";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Picks } from "@/components/Picks";
import { ProfileCard } from "@/components/ProfileCard";
import { Skins } from "@/components/Skins";
import { AVOID_PICKS, CLOSING, COUNTERS, GOOD_PICKS, PLAYSTYLE } from "@/data/profile";
import { loadDdragon } from "@/lib/ddragon";

// why: Data Dragon publishes a new version every patch; refreshing daily keeps portraits current.
export const revalidate = 86400;

export default async function Home() {
  const ids = [...GOOD_PICKS, ...AVOID_PICKS, ...COUNTERS].map((c) => c.id);
  const ddragon = await loadDdragon(ids, { next: { revalidate } });

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Hero />
      <main id="conteudo">
        <ProfileCard />
        <Picks initial={ddragon} />
        <Counters data={ddragon} />

        <section id="como-eu-jogo" className="section" aria-labelledby="style-title">
          <h2 id="style-title" className="section__title">
            Como eu jogo?
          </h2>
          <div className="style-grid">
            {PLAYSTYLE.map((s) => (
              <article key={s.title} className="style-card">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        <Kit />

        <Skins />

        <section className="closing" aria-label="Recado final">
          <p>{CLOSING}</p>
        </section>
      </main>

      <footer className="footer">
        <p>
          Projeto de fã feito por PykeGap. Imagens e vídeos de League of Legends são da Riot Games, obtidos do{" "}
          <a href="https://developer.riotgames.com/docs/lol#data-dragon" target="_blank" rel="noreferrer">
            Data Dragon
          </a>{" "}
          e da{" "}
          <a href="https://www.leagueoflegends.com/pt-br/champions/pyke/" target="_blank" rel="noreferrer">
            página oficial do Pyke
          </a>
          .
        </p>
        <p className="footer__legal">
          Mono Pyke foi criado seguindo a política do “Lenga-Lenga Jurídico” da Riot Games com recursos pertencentes à
          Riot Games. A Riot Games não endossa ou patrocina este projeto.
        </p>
        <p lang="en" className="footer__legal">
          Mono Pyke was created under Riot Games&apos; “Legal Jibber Jabber” policy using assets owned by Riot Games. Riot
          Games does not endorse or sponsor this project.
        </p>
      </footer>
      <MusicPlayer />
    </>
  );
}
