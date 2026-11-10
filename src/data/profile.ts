export type Champion = {
  /** Data Dragon champion id (key of champion.json `data`). */
  id: string;
  /** Display name as the player writes it. */
  name: string;
  /** Numeric champion key, used by Riot's ability-preview CDN. */
  key: number;
};

export const PROFILE = {
  name: "PykeGap",
  /** Riot ID tagline, shown next to the name. */
  tag: "#ggwp",
  since: "Mono Pyke desde 2021",
  mastery: "1.500.000+",
  masteryLabel: "pontos de maestria com Pyke",
  rank: "Diamante",
  rankIcon: "/images/rank-diamond.png",
  quote: "Bora amassa esses newba",
  photo: "/images/profile-photo.jpeg",
  photoAlt: "PykeGap, jogador de Pyke",
};

export const PYKE: Champion = { id: "Pyke", name: "Pyke", key: 555 };

export const GOOD_PICKS: Champion[] = [
  { id: "Kaisa", name: "Kai’Sa", key: 145 },
  { id: "Draven", name: "Draven", key: 119 },
  { id: "Ashe", name: "Ashe", key: 22 },
  { id: "Samira", name: "Samira", key: 360 },
  { id: "Kalista", name: "Kalista", key: 429 },
];

export const AVOID_PICKS: Champion[] = [
  { id: "Ezreal", name: "Ezreal", key: 81 },
  { id: "Veigar", name: "Veigar", key: 45 },
  { id: "Viktor", name: "Viktor", key: 112 },
  { id: "Syndra", name: "Syndra", key: 134 },
  { id: "Senna", name: "Senna", key: 235 },
];

export const PICK_TEXT = {
  good: {
    title: "Combina bem comigo",
    body: "Gosto de jogar com campeões que conseguem acompanhar minha entrada e aproveitar a janela quando eu acerto o gancho ou o stun.",
  },
  avoid: {
    title: "Prefiro evitar",
    body: "Com esses picks, geralmente ajusto o ritmo da lane. Prefiro duplas que consigam acompanhar minhas entradas mais de perto.",
    extra: "e outros magos no bot",
  },
};

export const PLAYSTYLE = [
  {
    title: "Pressão na lane",
    body: "Contra suportes de peel e poke, costumo jogar agressivo e procurar janelas para entrar. Contra suportes de engage, jogo com mais cautela conforme a ameaça do outro lado e escolho melhor a hora de puxar a luta.",
  },
  {
    title: "Roaming ou jogar junto",
    body: "Se a composição do meu time favorece o roaming, dou prioridade a sair da lane para criar jogadas no mapa. Se eu perceber que o melhor é ficar com meu atirador, jogo junto e procuro criar vantagem no bot.",
  },
];

export const CLOSING = "Eu confio no meu time. Se a gente jogar junto, sempre dá pra criar uma chance.";

export type Counter = Champion & {
  reason: string;
  /** Official ability clips for the abilities the reason names. */
  clips: { ability: "P1" | "Q1" | "W1" | "E1" | "R1"; label: string }[];
};

/** Enemy supports that shut Pyke down, described in the third person; revealed on tap. */
export const COUNTERS: Counter[] = [
  {
    id: "Morgana",
    name: "Morgana",
    key: 25,
    reason: "O Escudo Negro (E) bloqueia o puxão do Q e o stun do E do Pyke.",
    clips: [{ ability: "E1", label: "E · Escudo Negro" }],
  },
  {
    id: "Thresh",
    name: "Thresh",
    key: 412,
    reason: "O Esfolar (E) interrompe a entrada do Pyke, e a Passagem Sombria (W) tira o alvo puxado de perigo.",
    clips: [
      { ability: "E1", label: "E · Esfolar" },
      { ability: "W1", label: "W · Passagem Sombria" },
    ],
  },
  {
    id: "Rell",
    name: "Rell",
    key: 526,
    reason: "Com a Tempestade Magnética (R), vira a luta quando o Pyke usa o E para entrar e fica perto do ADC aliado.",
    clips: [{ ability: "R1", label: "R · Tempestade Magnética" }],
  },
  {
    id: "Poppy",
    name: "Poppy",
    key: 78,
    reason: "A Presença Inabalável (W) bloqueia o E do Pyke se ele atravessar a área, e perto da parede ela ameaça atordoá-lo.",
    clips: [{ ability: "W1", label: "W · Presença Inabalável" }],
  },
  {
    id: "Nautilus",
    name: "Nautilus",
    key: 111,
    reason: "Tem CC suficiente para prender o Pyke e a Carga de Profundidade (R), uma ult direcionada para iniciar no ADC aliado.",
    clips: [{ ability: "R1", label: "R · Carga de Profundidade" }],
  },
];
