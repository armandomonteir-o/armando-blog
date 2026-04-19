// MOCK DATA — replace with WPGraphQL query in issue #11
export interface PlaylistTrack {
  title: string;
  artist: string;
  duration: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  genres: string[];
  trackCount: number;
  totalDuration: string;
  followers: number;
  spotifyUrl: string;
  lastUpdated: string;
  accentColor: string;
  tracks: PlaylistTrack[];
}

export const genres = [
  "Synthwave",
  "Punk",
  "Lo-Fi",
  "Ambient",
  "Eletronica",
  "Jazz",
  "Hip-Hop",
  "Post-Rock",
  "Vaporwave",
  "Classica",
  "Dark Ambient",
] as const;

export type Genre = (typeof genres)[number];

export const genreColors: Record<string, string> = {
  Synthwave: "#f59e0b",
  Punk: "#e05050",
  "Lo-Fi": "#a78bfa",
  Ambient: "#5eead4",
  Eletronica: "#3b82f6",
  Jazz: "#f97316",
  "Hip-Hop": "#facc15",
  "Post-Rock": "#94a3b8",
  Vaporwave: "#c084fc",
  Classica: "#f9a8d4",
  "Dark Ambient": "#64748b",
};

export const playlists: Playlist[] = [
  {
    id: "pl-001",
    name: "NEON DRIVE",
    description:
      "A trilha perfeita para coding sessions noturnas. Synthwave puro, arpeggios analógicos e basses que pulsam como neon em chuva digital.",
    coverImage:
      "https://images.unsplash.com/photo-1771012788591-a1c7e6763e5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeW50aHdhdmUlMjBuZW9uJTIwbXVzaWMlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzcyODk3Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Synthwave", "Eletronica"],
    trackCount: 42,
    totalDuration: "2h 48min",
    followers: 1247,
    spotifyUrl: "#",
    lastUpdated: "02 Mar 2026",
    accentColor: "#f59e0b",
    tracks: [
      { title: "Nightcall", artist: "Kavinsky", duration: "4:16" },
      { title: "Tech Noir", artist: "Gunship", duration: "5:43" },
      { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
      { title: "Turbo Killer", artist: "Carpenter Brut", duration: "4:17" },
      { title: "A Real Hero", artist: "College & Electric Youth", duration: "4:56" },
    ],
  },
  {
    id: "pl-002",
    name: "DESTROY//REBUILD",
    description:
      "Punk, hardcore e noise para quando o código não compila. Energia bruta, riffs distorcidos e a urgência de quem não aceita o status quo.",
    coverImage:
      "https://images.unsplash.com/photo-1640680406508-6da20a3338b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdW5rJTIwcm9jayUyMGNvbmNlcnQlMjBlbmVyZ3l8ZW58MXx8fHwxNzcyODk3Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Punk"],
    trackCount: 35,
    totalDuration: "1h 52min",
    followers: 863,
    spotifyUrl: "#",
    lastUpdated: "28 Fev 2026",
    accentColor: "#e05050",
    tracks: [
      { title: "Holiday in Cambodia", artist: "Dead Kennedys", duration: "4:36" },
      { title: "Blitzkrieg Bop", artist: "Ramones", duration: "2:14" },
      { title: "Rise Above", artist: "Black Flag", duration: "2:47" },
      { title: "Revolution", artist: "Atari Teenage Riot", duration: "3:58" },
      { title: "Anarchy in the U.K.", artist: "Sex Pistols", duration: "3:32" },
    ],
  },
  {
    id: "pl-003",
    name: "STATIC RAIN",
    description:
      "Lo-fi beats e texturas ambient para foco profundo. Como chuva em uma janela de vidro embaçada — presente, mas nunca intrusiva.",
    coverImage:
      "https://images.unsplash.com/photo-1582068019386-a943ee9287ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsby1maSUyMGFtYmllbnQlMjBiZWRyb29tJTIwc3R1ZGlvfGVufDF8fHx8MTc3Mjg5NzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Lo-Fi", "Ambient"],
    trackCount: 58,
    totalDuration: "3h 22min",
    followers: 2104,
    spotifyUrl: "#",
    lastUpdated: "05 Mar 2026",
    accentColor: "#a78bfa",
    tracks: [
      { title: "Feather", artist: "Nujabes", duration: "4:08" },
      { title: "Aruarian Dance", artist: "Nujabes", duration: "3:17" },
      { title: "Reflection Eternal", artist: "Nujabes", duration: "5:44" },
      { title: "Shiki No Uta", artist: "MINMI", duration: "4:12" },
      { title: "Counting Stars", artist: "Nujabes", duration: "4:40" },
    ],
  },
  {
    id: "pl-004",
    name: "MIDNIGHT JAZZ PROTOCOL",
    description:
      "Jazz experimental, fusion e bebop para noites de reflexão. De Coltrane a Kamasi Washington — o improviso como forma de pensar.",
    coverImage:
      "https://images.unsplash.com/photo-1633629284939-f2fd9bbe2740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwdmlueWwlMjByZWNvcmQlMjB0dXJudGFibGV8ZW58MXx8fHwxNzcyODk3Mzc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Jazz"],
    trackCount: 31,
    totalDuration: "2h 15min",
    followers: 756,
    spotifyUrl: "#",
    lastUpdated: "20 Fev 2026",
    accentColor: "#f97316",
    tracks: [
      { title: "A Love Supreme, Pt. I", artist: "John Coltrane", duration: "7:43" },
      { title: "So What", artist: "Miles Davis", duration: "9:22" },
      { title: "Fists of Fury", artist: "Kamasi Washington", duration: "8:42" },
      { title: "Maiden Voyage", artist: "Herbie Hancock", duration: "7:58" },
      { title: "Naima", artist: "John Coltrane", duration: "4:23" },
    ],
  },
  {
    id: "pl-005",
    name: "CIRCUIT BREAKER",
    description:
      "Eletrônica pesada, techno industrial e IDM. Para quando você precisa entrar em modo máquina e processar tudo em paralelo.",
    coverImage:
      "https://images.unsplash.com/photo-1768885510237-9238a40a4f93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBESiUyMGRhcmt8ZW58MXx8fHwxNzcyODEyNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Eletronica"],
    trackCount: 48,
    totalDuration: "3h 05min",
    followers: 1532,
    spotifyUrl: "#",
    lastUpdated: "01 Mar 2026",
    accentColor: "#3b82f6",
    tracks: [
      { title: "Windowlicker", artist: "Aphex Twin", duration: "6:07" },
      { title: "Spastik", artist: "Plastikman", duration: "7:31" },
      { title: "Acid Rain", artist: "Burial", duration: "5:12" },
      { title: "We Are the Music Makers", artist: "Aphex Twin", duration: "7:43" },
      { title: "The Bells", artist: "Jeff Mills", duration: "5:58" },
    ],
  },
  {
    id: "pl-006",
    name: "SONATA.EXE",
    description:
      "Clássica reimaginada. De Bach a Max Richter, peças que provam que os melhores algoritmos foram escritos em pentagrama séculos atrás.",
    coverImage:
      "https://images.unsplash.com/photo-1760491900404-9beb0d216869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBwaWFubyUyMGtleXMlMjBkcmFtYXRpY3xlbnwxfHx8fDE3NzI4OTczNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Classica"],
    trackCount: 24,
    totalDuration: "2h 40min",
    followers: 489,
    spotifyUrl: "#",
    lastUpdated: "14 Fev 2026",
    accentColor: "#f9a8d4",
    tracks: [
      { title: "Cello Suite No. 1", artist: "Bach / Yo-Yo Ma", duration: "2:41" },
      { title: "On the Nature of Daylight", artist: "Max Richter", duration: "6:07" },
      { title: "Gymnopédie No. 1", artist: "Erik Satie", duration: "3:02" },
      { title: "Nuvole Bianche", artist: "Ludovico Einaudi", duration: "5:57" },
      { title: "Moonlight Sonata", artist: "Beethoven", duration: "6:14" },
    ],
  },
  {
    id: "pl-007",
    name: "CONCRETE POETRY",
    description:
      "Hip-hop underground, boom bap e rap consciente. Lirismo que decodifica a realidade e beats que constroem novas arquiteturas sonoras.",
    coverImage:
      "https://images.unsplash.com/photo-1565970460548-9a073fd8e6ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjB1cmJhbiUyMGdyYWZmaXRpfGVufDF8fHx8MTc3Mjg5NzM3OHww&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Hip-Hop"],
    trackCount: 39,
    totalDuration: "2h 28min",
    followers: 1089,
    spotifyUrl: "#",
    lastUpdated: "25 Fev 2026",
    accentColor: "#facc15",
    tracks: [
      { title: "NY State of Mind", artist: "Nas", duration: "4:53" },
      { title: "C.R.E.A.M.", artist: "Wu-Tang Clan", duration: "4:12" },
      { title: "Ms. Jackson", artist: "Outkast", duration: "4:54" },
      { title: "Alright", artist: "Kendrick Lamar", duration: "3:39" },
      { title: "Electric Relaxation", artist: "A Tribe Called Quest", duration: "4:08" },
    ],
  },
  {
    id: "pl-008",
    name: "EVENT HORIZON",
    description:
      "Post-rock e shoegaze para expandir a mente. Guitarras que se tornam paisagens, baterias que marcam o tempo cósmico, silêncios que dizem tudo.",
    coverImage:
      "https://images.unsplash.com/photo-1610449291352-445fe4100c15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3N0JTIwcm9jayUyMHNob2VnYXplJTIwZXRoZXJlYWx8ZW58MXx8fHwxNzcyODk3Mzc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Post-Rock", "Ambient"],
    trackCount: 22,
    totalDuration: "2h 58min",
    followers: 634,
    spotifyUrl: "#",
    lastUpdated: "18 Fev 2026",
    accentColor: "#94a3b8",
    tracks: [
      { title: "The Only Moment We Were Alone", artist: "Explosions in the Sky", duration: "6:18" },
      { title: "Storm", artist: "Godspeed You! Black Emperor", duration: "22:32" },
      { title: "When You Sleep", artist: "My Bloody Valentine", duration: "4:02" },
      { title: "Your Hand in Mine", artist: "Explosions in the Sky", duration: "8:17" },
      { title: "Sleep", artist: "Godspeed You! Black Emperor", duration: "23:18" },
    ],
  },
  {
    id: "pl-009",
    name: "VOID TRANSMISSION",
    description:
      "Dark ambient e drone para mergulhos profundos no subconsciente. Sons que habitam os espaços entre os pensamentos.",
    coverImage:
      "https://images.unsplash.com/photo-1771773637784-35552060dd9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYW1iaWVudCUyMGluZHVzdHJpYWwlMjBhdG1vc3BoZXJlfGVufDF8fHx8MTc3Mjg5NzM3OHww&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Dark Ambient", "Ambient"],
    trackCount: 18,
    totalDuration: "3h 12min",
    followers: 312,
    spotifyUrl: "#",
    lastUpdated: "10 Fev 2026",
    accentColor: "#64748b",
    tracks: [
      { title: "Substrata", artist: "Biosphere", duration: "7:28" },
      { title: "The Drift", artist: "Scott Walker", duration: "9:04" },
      { title: "Ravedeath, 1972", artist: "Tim Hecker", duration: "6:40" },
      { title: "An Empty Bliss Beyond This World", artist: "The Caretaker", duration: "3:18" },
      { title: "Virgins", artist: "Tim Hecker", duration: "8:11" },
    ],
  },
  {
    id: "pl-010",
    name: "MALL_MEMORIES.WAV",
    description:
      "Vaporwave, future funk e mallsoft. A nostalgia de um passado consumista, filtrada através de camadas de reverb e desaceleração proposital.",
    coverImage:
      "https://images.unsplash.com/photo-1684177125022-4aa763748420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YXBvcndhdmUlMjByZXRybyUyMHB1cnBsZSUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NzI4OTczNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genres: ["Vaporwave", "Eletronica"],
    trackCount: 33,
    totalDuration: "1h 45min",
    followers: 978,
    spotifyUrl: "#",
    lastUpdated: "22 Fev 2026",
    accentColor: "#c084fc",
    tracks: [
      { title: "Macintosh Plus", artist: "Macintosh Plus", duration: "7:16" },
      { title: "Teen Pregnancy", artist: "Blank Banshee", duration: "2:21" },
      { title: "Palm Mall", artist: "Cat System Corp", duration: "3:47" },
      { title: "Nobody Here", artist: "INTERNET CLUB", duration: "4:02" },
      { title: "ECO VIRTUAL", artist: "Eco Virtual", duration: "5:33" },
    ],
  },
];

export function getPlaylistsByGenre(selectedGenres: string[]): Playlist[] {
  if (selectedGenres.length === 0) return playlists;
  return playlists.filter((pl) =>
    pl.genres.some((g) => selectedGenres.includes(g))
  );
}
