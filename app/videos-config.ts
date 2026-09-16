export const VIDEOS = [
  {
    id: "ot",
    title: "OT",
    vimeoId: "1227013944",
    vimeoHash: "3a3dc83c70",
    isBonus: false,
  },
  {
    id: "lecture1",
    title: "1강",
    vimeoId: "1227013936",
    vimeoHash: "3fbcad3659",
    isBonus: false,
  },
  {
    id: "lecture2",
    title: "2강",
    vimeoId: "1227007331",
    vimeoHash: "b1cc9c6a4a",
    isBonus: false,
  },
  {
    id: "lecture3",
    title: "3강",
    vimeoId: "1227007329",
    vimeoHash: "9249a7787b",
    isBonus: false,
  },
  {
    id: "lecture4",
    title: "4강",
    vimeoId: "1227007330",
    vimeoHash: "8ae104a7a1",
    isBonus: false,
  },
  {
    id: "lecture5",
    title: "5강",
    vimeoId: "1227007328",
    vimeoHash: "1efd23e9bd",
    isBonus: false,
  },
  {
    id: "lecture6",
    title: "6강",
    vimeoId: "1227013937",
    vimeoHash: "a4c8496ca5",
    isBonus: false,
  },
  {
    id: "lecture7",
    title: "7강",
    vimeoId: "1227008108",
    vimeoHash: "0ed6951847",
    isBonus: false,
  },
  {
    id: "lecture8",
    title: "8강",
    vimeoId: "1227008598",
    vimeoHash: "6d7f9d961d",
    isBonus: false,
  },
  {
    id: "lecture9",
    title: "9강",
    vimeoId: "1227010060",
    vimeoHash: "dfca2bd957",
    isBonus: false,
  },
  {
    id: "lecture10",
    title: "10강",
    vimeoId: "1227010099",
    vimeoHash: "1d3c2c505a",
    isBonus: false,
  },
  {
    id: "bonus",
    title: "BONUS. EASY & RELAX",
    subtitle: "마음을 가볍게 하는 확언과 노래",
    vimeoId: "1227032865",
    vimeoHash: "7d6b1ce9d7",
    isBonus: true,
  },
];

export function getVimeoEmbedUrl(vimeoId: string, hash: string): string {
  return `https://player.vimeo.com/video/${vimeoId}?h=${hash}`;
}
