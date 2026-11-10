export type Ability = "P1" | "Q1" | "W1" | "E1" | "R1";

export const PYKE_PAGE = "https://www.leagueoflegends.com/pt-br/champions/pyke/";

export type PykeVideo =
  | { kind: "youtube"; id: string; label: string; title: string; caption: string }
  | { kind: "clip"; ability: Ability; label: string; caption: string };

/** Official Login Screen: the default-skin splash art, animated. Hero background loop (HD only) and first tab of "Ver Pyke em ação". */
export const HERO_LOOP = {
  kind: "youtube",
  id: "cHRvLl8hpqc",
  label: "Login Screen",
  title: "Pyke, the Bloodharbor Ripper | Login Screen - League of Legends",
  caption: "Tela de login oficial: a splash padrão do Pyke animada. Player oficial do YouTube, canal League of Legends.",
} as const satisfies PykeVideo;

/**
 * invariant: YouTube entries come from the official League of Legends channel and are
 * only shown through the official embedded player (embedding is the permitted use).
 */
export const PYKE_VIDEOS: PykeVideo[] = [
  HERO_LOOP,
  {
    kind: "youtube",
    id: "g2mara8nFVE",
    label: "Champion Spotlight",
    title: "Pyke Champion Spotlight | Gameplay - League of Legends",
    caption: "Guia oficial de gameplay do Pyke. Player oficial do YouTube, canal League of Legends.",
  },
  { kind: "clip", ability: "Q1", label: "Q · Gancho", caption: "Q: o gancho que puxa o alvo para perto." },
  { kind: "clip", ability: "E1", label: "E · Stun", caption: "E: o avanço que atordoa quem estiver no caminho." },
  { kind: "clip", ability: "R1", label: "R · Execução", caption: "R: a ultimate que executa e divide o ouro." },
];

export const PYKE_TITLE = "o Estripador das Águas Sangrentas";

/** Pyke's kit: names from the pt-BR game data, icons bundled under /images/abilities. */
export const PYKE_KIT: { ability: Ability; key: string; name: string; icon: string; blurb: string }[] = [
  { ability: "P1", key: "P", name: "Dádiva dos Afogados", icon: "/images/abilities/pyke-passive.png", blurb: "Some da visão inimiga e recupera vida enquanto ninguém me vê." },
  { ability: "Q1", key: "Q", name: "Espeto de Osso", icon: "/images/abilities/pyke-q.png", blurb: "O gancho. Puxa o alvo para o meu time." },
  { ability: "W1", key: "W", name: "Mergulho Fantasma", icon: "/images/abilities/pyke-w.png", blurb: "Camuflagem e velocidade para chegar sem ser visto." },
  { ability: "E1", key: "E", name: "Ressaca Espectral", icon: "/images/abilities/pyke-e.png", blurb: "Avanço que deixa um fantasma e atordoa quem estiver no caminho." },
  { ability: "R1", key: "R", name: "Morte das Profundezas", icon: "/images/abilities/pyke-r.png", blurb: "Executa quem está com pouca vida e divide o ouro com quem ajudou." },
];

export type Rarity = "Épica" | "Lendária" | "Mítica";

/** Skin splashes (1280×720) bundled under /images/skins; names from the pt-BR game data. */
export const PYKE_SKINS: { num: number; name: string; rarity: Rarity }[] = [
  { num: 1, name: "Pyke Espectro das Areias", rarity: "Épica" },
  { num: 9, name: "Pyke Lua Sangrenta", rarity: "Épica" },
  { num: 16, name: "PROJETO: Pyke", rarity: "Lendária" },
  { num: 25, name: "Pyke PsyOps", rarity: "Épica" },
  { num: 34, name: "Pyke Sentinela", rarity: "Épica" },
  { num: 44, name: "Pyke Guerreiro das Cinzas", rarity: "Mítica" },
  { num: 45, name: "Pyke Empíreo", rarity: "Lendária" },
  { num: 53, name: "Pyke Soul Fighter", rarity: "Épica" },
  { num: 54, name: "Pyke Soul Fighter de Prestígio", rarity: "Mítica" },
  { num: 64, name: "Pyke Noite Apavorante", rarity: "Épica" },
  { num: 74, name: "Pyke Tinta Sombria", rarity: "Épica" },
  { num: 75, name: "Pyke T1", rarity: "Épica" },
];

export const skinSrc = (num: number) => `/images/skins/pyke-${num}.jpg`;
