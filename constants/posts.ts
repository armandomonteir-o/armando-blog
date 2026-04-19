// TODO issue #11: replace with WPGraphQL query

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  date: string;
  reads: number;
  comments: number;
  image: string;
  excerpt: string;
  isCorrupted?: boolean;
}

export const posts: Post[] = [
  {
    id: 1,
    title: "PIXEL ART E A NOSTALGIA DIGITAL",
    slug: "pixel-art-e-a-nostalgia-digital",
    category: "Estudos",
    date: "28 Fev 2026",
    reads: 128,
    comments: 23,
    image:
      "https://images.unsplash.com/photo-1649877508777-1554357604eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGNvbXB1dGVyJTIwcGl4ZWwlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzcyODMzNDYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "Uma investigacao sobre como a estetica pixel se tornou simbolo de resistencia cultural na era da ultra-definicao.",
  },
  {
    id: 2,
    title: "GLITCH: A BELEZA DO ERRO",
    slug: "glitch-a-beleza-do-erro",
    category: "Filosofia",
    date: "22 Fev 2026",
    reads: 95,
    comments: 17,
    image:
      "https://images.unsplash.com/photo-1575907153548-ccfef23907a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGl0Y2glMjBhcnQlMjBuZW9ufGVufDF8fHx8MTc3MjgzMzQ2MXww&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "Como os erros digitais se transformam em arte e questionam nossa obsessao por perfeicao tecnologica.",
  },
  {
    id: 3,
    title: "SYNTHWAVE: SOM DO FUTURO PASSADO",
    slug: "synthwave-som-do-futuro-passado",
    category: "Músicas",
    date: "18 Fev 2026",
    reads: 210,
    comments: 34,
    image:
      "https://images.unsplash.com/photo-1767481626894-bab78ae919be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeW50aHdhdmUlMjBsYW5kc2NhcGUlMjBwdXJwbGV8ZW58MXx8fHwxNzcyODMzNDYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "A trilha sonora retro-futurista que conecta os anos 80 ao universo digital contemporaneo.",
  },
  {
    id: 4,
    title: "NEON NOIR: CIDADES QUE NAO DORMEM",
    slug: "neon-noir-cidades-que-nao-dormem",
    category: "Filmes",
    date: "12 Fev 2026",
    reads: 156,
    comments: 28,
    image:
      "https://images.unsplash.com/photo-1647014475010-77094d39fadd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmlnaHR8ZW58MXx8fHwxNzcyODMzNDYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "Uma analise visual das cidades cyberpunk no cinema e como elas influenciam o design digital moderno.",
  },
  {
    id: 5,
    title: "ARTE GENERATIVA E CONSCIENCIA",
    slug: "arte-generativa-e-consciencia",
    category: "Filosofia",
    date: "06 Fev 2026",
    reads: 87,
    comments: 12,
    image:
      "https://images.unsplash.com/photo-1713188090500-a4fb0d2cf309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRpZ2l0YWwlMjBhcnQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI3MzEwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "Quando maquinas criam arte, onde reside a intencao? Uma reflexao sobre algoritmos e expressao humana.",
  },
  {
    id: 6,
    title: "VAPORWAVE: ESTETICA DA MELANCOLIA",
    slug: "vaporwave-estetica-da-melancolia",
    category: "Músicas",
    date: "01 Fev 2026",
    reads: 143,
    comments: 21,
    image:
      "https://images.unsplash.com/photo-1700067617672-8ead4a1ac9a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YXBvcndhdmUlMjBzdGF0dWUlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzcyODMzNDYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "O movimento que transformou consumismo em arte e nostalgia em critica social atraves da musica e do visual.",
  },
  {
    id: 7,
    title: "BAUHAUS DIGITAL: FORMA SEGUE FUNCAO",
    slug: "bauhaus-digital-forma-segue-funcao",
    category: "Estudos",
    date: "27 Jan 2026",
    reads: 102,
    comments: 19,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZ2VvbWV0cmljJTIwZGVzaWdufGVufDF8fHx8MTc3MjgzNzk4MXww&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "Como os principios da Bauhaus ressurgem no design de interfaces e na estetica digital contemporanea.",
  },
  {
    id: 8,
    title: "CYBERPUNK LITERARIO: NEUROMANCER E ALEM",
    slug: "cyberpunk-literario-neuromancer-e-alem",
    category: "Livros",
    date: "21 Jan 2026",
    reads: 178,
    comments: 31,
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwbmVvbiUyMGRhcmt8ZW58MXx8fHwxNzcyODM3OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "Uma jornada pela ficcao cientifica que previu nosso presente digital e continua moldando o imaginario coletivo.",
  },
  {
    id: 9,
    title: "O SILENCIO DOS ALGORITMOS",
    slug: "o-silencio-dos-algoritmos",
    category: "Filosofia",
    date: "15 Jan 2026",
    reads: 64,
    comments: 9,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzcyODM3OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "O que os algoritmos decidem por nos quando nao estamos prestando atencao? Uma reflexao sobre autonomia digital.",
  },
  {
    id: 10,
    title: "BLADE RUNNER: SONHOS ELETRICOS",
    slug: "blade-runner-sonhos-eletricos",
    category: "Filmes",
    date: "08 Jan 2026",
    reads: 234,
    comments: 42,
    image:
      "https://images.unsplash.com/photo-1515705576963-95cad62945b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwbmlnaHQlMjBjaXR5JTIwbmVvbiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI4Mzc5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "Como Blade Runner redefiniu a estetica sci-fi e abriu caminho para toda uma geracao de artistas digitais.",
  },
  {
    id: 11,
    title: "KRAFTWERK: MAQUINAS COM ALMA",
    slug: "kraftwerk-maquinas-com-alma",
    category: "Músicas",
    date: "02 Jan 2026",
    reads: 119,
    comments: 16,
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBzeW50aGVzaXplcnxlbnwxfHx8fDE3NzI4Mzc5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "A historia dos pioneiros da musica eletronica e como Kraftwerk influenciou tudo, do techno ao hip-hop.",
  },
  {
    id: 12,
    title: "BORGES E O HIPERTEXTO",
    slug: "borges-e-o-hipertexto",
    category: "Livros",
    date: "26 Dez 2025",
    reads: 91,
    comments: 14,
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBvbGR8ZW58MXx8fHwxNzcyODM3OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt:
      "Como Jorge Luis Borges antecipou a internet, o hipertexto e os labirintos da navegacao digital.",
  },
  {
    id: 13,
    title: "█▓▒░ CORRUPTED_POST ░▒▓█",
    slug: "corrupted-post",
    category: "ERROR",
    date: "?? ??? ????",
    reads: 404,
    comments: 0,
    image:
      "https://images.unsplash.com/photo-1765445665844-5d317051b664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGl0Y2glMjBlcnJvciUyMGJyb2tlbiUyMHNjcmVlbiUyMGRpZ2l0YWx8ZW58MXx8fHwxNzcyODM3OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "FATAL: Este arquivo foi corrompido. Os dados nao puderam ser recuperados do servidor.",
    isCorrupted: true,
  },
];

export const categoryColors: Record<string, string> = {
  Estudos: "#4ade80",
  Filosofia: "#c084fc",
  Músicas: "#f59e0b",
  Filmes: "#e05050",
  Livros: "#80b0ff",
  ERROR: "#ff0000",
};
