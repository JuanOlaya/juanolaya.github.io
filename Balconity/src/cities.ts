/** One live camera of the installation, in the order the arrows cycle through them. */
export interface City {
  /** Stable id shared with the weather proxy whitelist (server/weather-proxy/src/cities.ts). */
  slug: string;
  /** Prefix of the legacy element ids (`<key>Cam`, `<key>Title`, `<key>Info`), kept so the CSS still applies. */
  key: string;
  /** Legacy CSS class that positions the title under the frame. */
  titleClass: string;
  title: string;
  timeZone: string;
  youtubeId: string;
  width: number;
  height: number;
}

export const CITIES: readonly City[] = [
  {
    slug: 'brasov',
    key: 'brasov',
    titleClass: 'brasovName',
    title: 'Romania, Brasov, Michael Weiss Street',
    timeZone: 'Europe/Bucharest',
    youtubeId: 'G05wmWFDtSo',
    width: 1254,
    height: 705,
  },
  {
    slug: 'sao-paulo',
    key: 'saoPaulo',
    titleClass: 'saoName',
    title: 'Brazil, São Paulo, Guarulhos International Airport',
    timeZone: 'America/Sao_Paulo',
    youtubeId: '2EwKLMpr_T4',
    width: 1355,
    height: 762,
  },
  {
    slug: 'taoyuan',
    key: 'taoyuan',
    titleClass: 'taoyuanName',
    title: 'Taiwan, Taoyuan, Daxi Old Street',
    timeZone: 'Asia/Taipei',
    youtubeId: 'z_mlibCfgFI',
    width: 1266,
    height: 712,
  },
  {
    slug: 'taipei',
    key: 'taipei',
    titleClass: 'taipeiName',
    title: 'Taiwan, Taipei City',
    timeZone: 'Asia/Taipei',
    youtubeId: 'z_fY1pj1VBw',
    width: 1268,
    height: 713,
  },
  {
    slug: 'odessa',
    key: 'odessa',
    titleClass: 'odessaName',
    title: "Ukraine, Odessa, Panteleimonivs'ka Street",
    timeZone: 'Europe/Kyiv',
    youtubeId: 'mp29PnTFVrc',
    width: 1264,
    height: 711,
  },
  {
    slug: 'tokyo',
    key: 'tokyo',
    titleClass: 'tokyoName',
    title: 'Japan, Tokyo, Shibuya Scramble Crossing',
    timeZone: 'Asia/Tokyo',
    youtubeId: 'HpdO5Kq3o7Y',
    width: 1268,
    height: 713,
  },
  {
    slug: 'verbier',
    key: 'verbier',
    titleClass: 'verbierName',
    title: 'Switzerland, Verbier Town',
    timeZone: 'Europe/Zurich',
    youtubeId: 'yDKJMdZTEXQ',
    width: 1248,
    height: 702,
  },
  {
    slug: 'venice',
    key: 'venice',
    titleClass: 'veniceName',
    title: 'Italy, Venice, Guglie Bridge',
    timeZone: 'Europe/Rome',
    youtubeId: 'HpZAez2oYsA',
    width: 1268,
    height: 713,
  },
  {
    slug: 'amsterdam',
    key: 'amsterdam',
    titleClass: 'amsterdamName',
    title: 'Netherlands, Amsterdam, Singel Canal',
    timeZone: 'Europe/Amsterdam',
    youtubeId: 'iB6Te_JP4Lk',
    width: 1248,
    height: 702,
  },
];

export function cameraUrl(city: City): string {
  return `https://www.youtube.com/embed/${city.youtubeId}?autoplay=1&mute=1&vq=hd1080`;
}
