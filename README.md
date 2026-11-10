# Mono Pyke — PykeGap#ggwp

Site pessoal de uma página (pt-BR) para compartilhar na seleção de campeões: hero do Pyke, card de perfil, kit do Pyke, o que pickar comigo, counters, como eu jogo e galeria de skins.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:3000
npm run build && npm start   # produção em http://localhost:3000
npm run lint       # ESLint + checagem de tipos
```

Stack: Next.js 16 (App Router) + TypeScript + CSS puro (`src/app/globals.css`).

### Publicação, SEO e 404
- **Endereço do site:** defina `NEXT_PUBLIC_SITE_URL` com o endereço final antes do build (ex.: `NEXT_PUBLIC_SITE_URL=https://seu-dominio.com npm run build`). Sem ela, o canônico, o `sitemap.xml`, o `robots.txt` e a imagem de compartilhamento apontam para `http://localhost:3000`.
- **Metadados:** título com modelo `%s · PykeGap#ggwp · Mono Pyke`, descrição, Open Graph e Twitter card (`src/app/layout.tsx`, `src/lib/site.ts`).
- **Rotas geradas:** `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/favicon.ico`, `/icon.png`, `/apple-icon.png` e `/opengraph-image.jpg` (splash padrão 1200×630).
- **Página 404:** `src/app/not-found.tsx`, com status 404, `noindex` e sem canônico.

## Estrutura

- `src/app/page.tsx`: página e rodapé (aviso de projeto de fã)
- `src/components/Hero.tsx`: splash + névoa, partículas, parallax e botão de pausar
- `src/components/ActionDialog.tsx`: “Ver Pyke em ação” (reprodução por clique)
- `src/components/ProfileCard.tsx`: card com a foto (`public/images/profile-photo.jpeg`)
- `src/components/Counters.tsx`: suportes que counteram o Pyke; o motivo aparece ao tocar
- `src/components/Kit.tsx`: habilidades do Pyke com clipe oficial por clique
- `src/components/Skins.tsx`: galeria de skins em tela cheia, com troca a cada 5 s, zoom lento, setas e botão Pausar
- `src/components/Picks.tsx`: listas de dupla com prévia por clique
- `src/data/profile.ts`, `src/data/media.ts`: textos e lista de vídeos
- `src/lib/ddragon.ts`: Data Dragon e URLs dos clipes oficiais

## Origem das mídias

### Data Dragon (Riot Games)
- Versões: https://ddragon.leagueoflegends.com/api/versions.json (usa a primeira, a mais recente)
- Dados: `https://ddragon.leagueoflegends.com/cdn/<versão>/data/pt_BR/champion.json`. O nome do arquivo de cada retrato sai de `data.<id>.image.full`.
- Retratos: `https://ddragon.leagueoflegends.com/cdn/<versão>/img/champion/<image.full>`
- Splash padrão do Pyke (hero): https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Pyke_0.jpg

A versão é resolvida no servidor e atualizada uma vez por dia (`revalidate = 86400`). Se o servidor não alcançar o Data Dragon, a página usa `14.24.1` e `<id>.png`, e o navegador do visitante tenta buscar `champion.json` de novo.

### Vídeos do Pyke em “Ver Pyke em ação”
| Vídeo | Fonte | Formato de uso |
|---|---|---|
| Pyke, the Bloodharbor Ripper — Login Screen | https://www.youtube.com/watch?v=cHRvLl8hpqc (canal League of Legends) | Player oficial incorporado, por clique |
| Pyke Champion Spotlight | https://www.youtube.com/watch?v=g2mara8nFVE (canal League of Legends) | Player oficial incorporado, por clique |
| Clipes Q, E e R | Página oficial do Pyke: https://www.leagueoflegends.com/pt-br/champions/pyke/ | Clipes `.webm` sem áudio, carregados por clique |

URLs dos clipes, testadas na ordem até uma funcionar:
1. `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0555/ability_0555_{Q1,E1,R1}.webm`
2. `https://lol.dyn.riotcdn.net/x/videos/champion-abilities/0555/ability_0555_{Q1,E1,R1}.webm`, o link atual da página oficial
3. `https://lol.dyn.riotcdn.net/x/videos/champion-abilities/0555/ability_0555_{Q1,E1,R1}.mp4`

### Prévias dos outros campeões (clique no card)
Clipe oficial da ultimate (R1), no mesmo padrão: `champion-abilities/<chave>/ability_<chave>_R1.webm`.
Chaves: Kai’Sa 0145, Draven 0119, Ashe 0022, Samira 0360, Kalista 0429, Ezreal 0081, Veigar 0045, Viktor 0112, Syndra 0134, Senna 0235.

Counters (clipe da habilidade citada, ao abrir o card): Morgana 0025 E1, Thresh 0412 E1 e W1, Rell 0526 R1, Poppy 0078 W1, Nautilus 0111 R1.

### Hero
- **Fundo:** splash padrão do Pyke (`Pyke_0.jpg`, 1215×717, a maior resolução oficial), animada com zoom lento, parallax, névoa, partículas e gradação verde-água. Tem botão "Pausar animação" e respeita `prefers-reduced-motion`.
- **Por que não há vídeo de fundo:** o Login Screen só pode ser usado pelo player do YouTube, e como fundo sem som o YouTube entrega 360p ou menos, o que fica borrado em tela cheia, sem que o site consiga forçar HD. O vídeo continua no player "Ver Pyke em ação", por clique, com controle de qualidade do YouTube.
- **Splash:** Data Dragon primeiro e cópia local `public/images/pyke-splash.jpg` como reserva.

### Cópias locais (CommunityDragon, espelho dos arquivos do jogo da Riot)
Usadas quando o Data Dragon não responde (algumas redes bloqueiam `leagueoflegends.com`), e para as skins e os ícones:
- **Retratos:** `public/images/champions/<id>.png`, de `https://cdn.communitydragon.org/latest/champion/<id>/square`
- **Splash padrão:** `public/images/pyke-splash.jpg`, de `https://cdn.communitydragon.org/latest/champion/Pyke/splash-art`
- **Skins:** `public/images/skins/pyke-<n>.jpg`, de `https://cdn.communitydragon.org/latest/champion/Pyke/splash-art/centered/skin/<n>`
- **Ícones das habilidades:** `public/images/abilities/pyke-<p|q|w|e|r>.png`, de `https://cdn.communitydragon.org/latest/champion/555/ability-icon/<passive|q|w|e|r>`
- **Brasão de Águas de Sentina (títulos das seções):** `public/images/bilgewater-crest.png`, recortado da imagem enviada pelo dono do site (fundo branco removido); arte da Riot Games
- **Emblema de maestria (nível 10+):** `public/images/mastery-10.png` e `mastery-aurora.png`, de `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/`
- **Emblema ranqueado Diamante:** `public/images/rank-diamond.png`, de `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-diamond.png`
- **Falas do Pyke (botões da hero):** `public/audio/pyke-choose-ptbr.ogg` e `pyke-ban-ptbr.ogg`, falas oficiais em pt-BR de seleção e banimento do campeão, de `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/champion-{choose,ban}-vo/555.ogg`. "O que pickar comigo" toca a de seleção e "Meus counters" a de banimento; "Como eu jogo?" não tem som. Tocam só no clique, volume 35%. São as únicas falas do Pyke exportadas como arquivo (as de partida ficam nos pacotes de áudio do jogo). Ogg Vorbis: Safari antigo pode não tocar, e aí o clique segue sem som.
- **Nomes em pt-BR (skins, habilidades, título):** `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/champions/555.json`

## Acessibilidade e fallbacks
- **Trilha do Pyke:** ao entrar, abre sozinho um mini player visível com o Login Screen oficial (animação + tema), ainda mudo. O som liga a 15% no primeiro clique, toque ou tecla em qualquer lugar da página, porque os navegadores bloqueiam áudio antes de qualquer interação. Fechar no ✕ fica salvo no navegador (`localStorage`), e o botão "♪ Trilha do Pyke" reabre. Com economia de dados ativa, não abre sozinho. O YouTube proíbe tocar só o áudio com o player escondido, por isso ele fica visível.
- Os botões da hero rolam suavemente até a seção com bolhas subindo pela tela; com `prefers-reduced-motion` o pulo é direto, sem bolhas. O foco vai para o título da seção.
- O botão de copiar o Riot ID usa a Clipboard API e, sem HTTPS, cai para `execCommand("copy")`.
- `prefers-reduced-motion`: sem vídeo de fundo, partículas, parallax ou troca automática de skins.
- Botão “Pausar animação” na hero. As prévias dos cards pausam e fecham com um segundo toque, e os clipes do player têm controles nativos.
- Nenhuma mídia carrega antes do clique. Fechar o player desmonta o vídeo.
- Se a splash falhar, aparece uma ilustração vetorial de arpão sobre o fundo animado.
- Se um retrato falhar, aparece um monograma com o nome do campeão.
- Se um clipe falhar, aparece “Prévia indisponível” ou um link para a página oficial.

## Aviso legal
Mono Pyke foi criado seguindo a política do “Lenga-Lenga Jurídico” da Riot Games com recursos pertencentes à Riot Games. A Riot Games não endossa ou patrocina este projeto. (https://www.riotgames.com/pt-br/juridico)
