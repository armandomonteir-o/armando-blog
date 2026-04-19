// MOCK DATA — replace with WPGraphQL query in issue #11
export interface Subcategory {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  postCount: number;
  tags: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    slug: "musicas",
    name: "Músicas",
    description:
      "Explorando as paisagens sonoras que definem a era digital — de sintetizadores analógicos a algoritmos generativos, cada frequência conta uma história sobre o futuro do som.",
    heroImage:
      "https://images.unsplash.com/photo-1730537456020-cd3bfd7c491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBuZW9uJTIwbGlnaHRzJTIwc3RhZ2V8ZW58MXx8fHwxNzcyODM1ODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    accentColor: "#f59e0b",
    gradientFrom: "rgba(245,158,11,0.3)",
    gradientTo: "rgba(2,42,110,0.9)",
    icon: "Music",
    subcategories: [
      {
        slug: "punk",
        name: "Punk",
        description:
          "A rebelião em forma de som. Do punk clássico ao digital hardcore, exploramos como o espírito DIY se reinventou na era dos algoritmos e plataformas digitais.",
        heroImage:
          "https://images.unsplash.com/photo-1717764450209-c467870b9037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdW5rJTIwcm9jayUyMGNvbmNlcnQlMjBtb3NoJTIwcGl0fGVufDF8fHx8MTc3MjgzNTg1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 8,
        tags: ["DIY", "Hardcore", "Subcultura", "Resistência"],
      },
      {
        slug: "synthwave",
        name: "Synthwave",
        description:
          "O futuro que os anos 80 sonharam. Sintetizadores analógicos, grades neon e pores-do-sol digitais — a trilha sonora de uma nostalgia que nunca existiu.",
        heroImage:
          "https://images.unsplash.com/photo-1767481626894-bab78ae919be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeW50aHdhdmUlMjBuZW9uJTIwcHVycGxlJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3MjgzNTg1OHww&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 12,
        tags: ["Retro", "Neon", "80s", "Eletrônico"],
      },
      {
        slug: "lo-fi",
        name: "Lo-fi",
        description:
          "A imperfeição como estética. Texturas de vinil, reverb de quarto e batidas suaves que transformam a produção caseira em arte contemplativa.",
        heroImage:
          "https://images.unsplash.com/photo-1741438662551-99924d14527a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcm9vbSUyMHdhcm0lMjBsaWdodCUyMHZpbnlsJTIwcmVjb3Jkc3xlbnwxfHx8fDE3NzI4MzU4NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 6,
        tags: ["Chill", "Beats", "Bedroom", "Textura"],
      },
      {
        slug: "ambient",
        name: "Ambient",
        description:
          "Sons que habitam o espaço entre a música e o silêncio. Paisagens sonoras que dissolvem as fronteiras entre o natural e o sintético.",
        heroImage:
          "https://images.unsplash.com/photo-1697575806233-224d248a5be9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWJpZW50JTIwbXVzaWMlMjBuYXR1cmUlMjBmb2clMjBmb3Jlc3R8ZW58MXx8fHwxNzcyODM1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 5,
        tags: ["Paisagem Sonora", "Meditativo", "Experimental", "Eno"],
      },
    ],
  },
  {
    slug: "filmes",
    name: "Filmes",
    description:
      "Cinema como portal para realidades alternativas. Análises visuais, ensaios sobre estética cinematográfica e a relação entre tela e consciência na era digital.",
    heroImage:
      "https://images.unsplash.com/photo-1762541693135-fb989de961e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBwcm9qZWN0b3IlMjBkYXJrJTIwdGhlYXRlcnxlbnwxfHx8fDE3NzI4MzU4NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    accentColor: "#e05050",
    gradientFrom: "rgba(224,80,80,0.3)",
    gradientTo: "rgba(2,42,110,0.9)",
    icon: "Film",
    subcategories: [
      {
        slug: "cyberpunk",
        name: "Cyberpunk",
        description:
          "High tech, low life. As visões distópicas que se tornaram profecia — de Blade Runner à realidade das megacorporações e cidades verticais.",
        heroImage:
          "https://images.unsplash.com/photo-1665237814256-16b9e0f697dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwc3RyZWV0JTIwbmlnaHQlMjByYWlufGVufDF8fHx8MTc3MjgzNTg1NHww&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 10,
        tags: ["Distopia", "Neon Noir", "Blade Runner", "Tecnologia"],
      },
      {
        slug: "noir",
        name: "Noir",
        description:
          "Sombras que contam histórias. O cinema noir e seu legado visual — do expressionismo alemão ao neo-noir digital contemporâneo.",
        heroImage:
          "https://images.unsplash.com/photo-1705317537519-ba155bf3fb5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwbm9pciUyMGRldGVjdGl2ZSUyMHNoYWRvd3N8ZW58MXx8fHwxNzcyODM1ODU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 7,
        tags: ["Sombras", "Detetive", "Expressionismo", "Neo-Noir"],
      },
      {
        slug: "sci-fi",
        name: "Sci-Fi",
        description:
          "Ficção científica como laboratório de futuros possíveis. Das viagens espaciais à singularidade, o cinema que imagina o amanhã.",
        heroImage:
          "https://images.unsplash.com/photo-1763198216782-b534fea3dcf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMHNwYWNlJTIwZnV0dXJpc3RpY3xlbnwxfHx8fDE3NzI4MTM2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 9,
        tags: ["Espaço", "Futuro", "Singularidade", "IA"],
      },
      {
        slug: "anime",
        name: "Anime",
        description:
          "A animação japonesa como linguagem universal. De Akira a obras contemporâneas, o anime redefine os limites da narrativa visual.",
        heroImage:
          "https://images.unsplash.com/photo-1764520408437-95890a95db4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGlsbHVzdHJhdGlvbiUyMGNvbG9yZnVsJTIwamFwYW5lc2V8ZW58MXx8fHwxNzcyODM1ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 11,
        tags: ["Akira", "Ghibli", "Narrativa Visual", "Mangá"],
      },
    ],
  },
  {
    slug: "livros",
    name: "Livros",
    description:
      "Palavras que constroem mundos. Resenhas, reflexões e ensaios sobre literatura que dialoga com tecnologia, arte e o espírito do nosso tempo.",
    heroImage:
      "https://images.unsplash.com/photo-1708548172199-72f7796d4206?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBib29rcyUyMGxpYnJhcnklMjBtb29keSUyMGRhcmt8ZW58MXx8fHwxNzcyODM1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    accentColor: "#80b0ff",
    gradientFrom: "rgba(128,176,255,0.3)",
    gradientTo: "rgba(2,42,110,0.9)",
    icon: "BookOpen",
    subcategories: [
      {
        slug: "ficcao-cientifica",
        name: "Ficção Científica",
        description:
          "Os livros que previram o futuro. De Philip K. Dick a Ted Chiang, a ficção científica literária como espelho deformado da realidade.",
        heroImage:
          "https://images.unsplash.com/photo-1760809847382-84a86f4aad7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2slMjBjb3ZlciUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzcyODM1ODU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 14,
        tags: ["Philip K. Dick", "Distopia", "Especulativo", "Clássicos"],
      },
      {
        slug: "filosofia-literaria",
        name: "Filosofia Literária",
        description:
          "Quando a filosofia veste roupas de literatura. Ensaios, romances filosóficos e textos que borram a linha entre pensar e narrar.",
        heroImage:
          "https://images.unsplash.com/photo-1672931505485-14016933f3ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlayUyMHN0YXR1ZSUyMHBoaWxvc29waHklMjBtYXJibGV8ZW58MXx8fHwxNzcyODM1ODYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 8,
        tags: ["Camus", "Sartre", "Ensaio", "Existência"],
      },
      {
        slug: "poesia",
        name: "Poesia",
        description:
          "Versos que hackeiam a linguagem. Da poesia concreta à poesia computacional, explorando como as palavras se tornam código e o código se torna verso.",
        heroImage:
          "https://images.unsplash.com/photo-1726377362206-4ee44eff5646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kd3JpdHRlbiUyMHBvZXRyeSUyMG5vdGVib29rJTIwbW9vZHl8ZW58MXx8fHwxNzcyODM1ODY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 6,
        tags: ["Concreta", "Digital", "Haiku", "Código"],
      },
      {
        slug: "graphic-novels",
        name: "Graphic Novels",
        description:
          "A narrativa em quadros. Das HQs underground às graphic novels que redefinem o que um livro pode ser — visual, visceral, vibrante.",
        heroImage:
          "https://images.unsplash.com/photo-1620928572438-075c466c48da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21pYyUyMGJvb2slMjBncmFwaGljJTIwbm92ZWwlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI4MzU4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 9,
        tags: ["HQ", "Underground", "Visual", "Moebius"],
      },
    ],
  },
  {
    slug: "filosofia",
    name: "Filosofia",
    description:
      "Pensamento na velocidade da luz. Reflexões sobre consciência, tecnologia, estética e ética na era onde humanos e máquinas coexistem e co-criam.",
    heroImage:
      "https://images.unsplash.com/photo-1767481256119-c863cad6cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRob3VnaHQlMjBwaGlsb3NvcGh5JTIwZGFya3xlbnwxfHx8fDE3NzI4MzU4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    accentColor: "#c084fc",
    gradientFrom: "rgba(192,132,252,0.3)",
    gradientTo: "rgba(2,42,110,0.9)",
    icon: "Brain",
    subcategories: [
      {
        slug: "existencialismo",
        name: "Existencialismo",
        description:
          "A liberdade radical de existir. Como o existencialismo clássico ilumina nossos dilemas digitais — solidão online, autenticidade filtrada, ansiedade algorítmica.",
        heroImage:
          "https://images.unsplash.com/photo-1727121274616-f016dd41145c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGlzdGVudGlhbGlzbSUyMGRhcmslMjBtb29keSUyMHBlcnNvbiUyMGFsb25lfGVufDF8fHx8MTc3MjgzNTg2MXww&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 7,
        tags: ["Sartre", "Liberdade", "Angústia", "Autenticidade"],
      },
      {
        slug: "pos-humanismo",
        name: "Pós-humanismo",
        description:
          "Além do humano. Cyborgs, uploads mentais e a dissolução das fronteiras entre orgânico e digital — o que vem depois de nós?",
        heroImage:
          "https://images.unsplash.com/photo-1737644467636-6b0053476bb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGh1bWFub2lkJTIwYXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwxfHx8fDE3NzI4MzU4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 5,
        tags: ["Cyborg", "Transhumanismo", "Singularidade", "Haraway"],
      },
      {
        slug: "estetica",
        name: "Estética",
        description:
          "A filosofia do belo na era do pixel. O que torna algo bonito quando tudo pode ser gerado por IA? Reflexões sobre forma, cor e significado.",
        heroImage:
          "https://images.unsplash.com/photo-1760662347435-1c0a11fea640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwYWVzdGhldGljJTIwbWluaW1hbHxlbnwxfHx8fDE3NzI4MzU4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 9,
        tags: ["Beleza", "Forma", "Percepção", "Arte Digital"],
      },
      {
        slug: "etica-digital",
        name: "Ética Digital",
        description:
          "Os dilemas morais do código. Privacidade, vigilância, viés algorítmico e responsabilidade — quem responde quando o algoritmo erra?",
        heroImage:
          "https://images.unsplash.com/photo-1554936970-e49a373f6967?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZXRoaWNzJTIwc3VydmVpbGxhbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI4MzU4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 6,
        tags: ["Privacidade", "Vigilância", "Viés", "Responsabilidade"],
      },
    ],
  },
  {
    slug: "estudos",
    name: "Estudos",
    description:
      "Aprender fazendo. Tutoriais, análises técnicas e explorações práticas na intersecção entre arte e programação — onde criatividade encontra compilador.",
    heroImage:
      "https://images.unsplash.com/photo-1771942202908-6ce86ef73701?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGNvZGluZyUyMHNjcmVlbiUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MjgzNTg0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    accentColor: "#4ade80",
    gradientFrom: "rgba(74,222,128,0.3)",
    gradientTo: "rgba(2,42,110,0.9)",
    icon: "GraduationCap",
    subcategories: [
      {
        slug: "programacao-criativa",
        name: "Programação Criativa",
        description:
          "Código como pincel. Processing, p5.js, shaders e além — transformando lógica computacional em expressão artística visual e sonora.",
        heroImage:
          "https://images.unsplash.com/photo-1614995008867-32eef7bff38c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHByb2dyYW1taW5nJTIwZ2VuZXJhdGl2ZSUyMGFydHxlbnwxfHx8fDE3NzI4MzU4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 15,
        tags: ["p5.js", "Processing", "Shaders", "Canvas"],
      },
      {
        slug: "design-generativo",
        name: "Design Generativo",
        description:
          "Quando regras criam beleza. Sistemas paramétricos, fractais e algoritmos evolutivos que geram formas impossíveis de imaginar manualmente.",
        heroImage:
          "https://images.unsplash.com/photo-1761182784487-b0b74f88cd40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5lcmF0aXZlJTIwZGVzaWduJTIwYWJzdHJhY3QlMjBwYXJ0aWNsZXN8ZW58MXx8fHwxNzcyODM1ODY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 8,
        tags: ["Paramétrico", "Fractal", "L-Systems", "Evolutivo"],
      },
      {
        slug: "ia-e-arte",
        name: "IA & Arte",
        description:
          "A inteligência artificial como co-criadora. GANs, diffusion models e redes neurais que pintam, compõem e escrevem — parceiras ou substitutas?",
        heroImage:
          "https://images.unsplash.com/photo-1737505599159-5ffc1dcbc08f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3NzI4MTkzNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 11,
        tags: ["GANs", "Diffusion", "Neural", "Co-criação"],
      },
      {
        slug: "pixel-art",
        name: "Pixel Art",
        description:
          "A arte da limitação. Cada pixel conta. Técnicas, história e a filosofia por trás da forma de arte mais deliberada do mundo digital.",
        heroImage:
          "https://images.unsplash.com/photo-1759171052927-83f3b3a72b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMHJldHJvJTIwZ2FtaW5nJTIwYXJjYWRlfGVufDF8fHx8MTc3MjgzNTg2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
        postCount: 13,
        tags: ["Sprites", "Dithering", "Paleta", "Retro"],
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategoryBySlug(
  categorySlug: string,
  subcategorySlug: string
): { category: Category; subcategory: Subcategory } | undefined {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return undefined;
  const subcategory = category.subcategories.find((s) => s.slug === subcategorySlug);
  if (!subcategory) return undefined;
  return { category, subcategory };
}
