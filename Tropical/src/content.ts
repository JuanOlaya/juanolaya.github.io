export type Lang = 'de' | 'en';

const de = {
  logo_subtitle: 'Gelato',
  nav_history: 'Geschichte',
  nav_flavors: 'Sorten',
  nav_location: 'Standort',
  nav_order: 'Jetzt Bestellen',
  hero_badge: 'SEIT 2024',
  hero_h1_p1: 'Ein',
  hero_h1_span: 'Urlaub',
  hero_h1_p2: 'in jeder Kugel.',
  hero_p:
    'Wir bringen die pulsierende Hitze des Äquators in das Herz Berlins. Handgemachtes Gelato, inspiriert von den Tropen.',
  btn_flavors: 'Sorten Entdecken',
  btn_visit: 'Besuche unsere Oase',
  about_h2: 'Aus den Tropen direkt nach Berlin',
  about_p1:
    'Alles begann mit einer Reise in ferne, exotische Länder. Wir verliebten uns in die Farben, die Energie und vor allem in den Geschmack tropischer Früchte.',
  about_p2:
    'Tropical ist unsere Antwort auf die Berliner Wintertage – eine Fusion aus urbanem Lifestyle und purer tropischer Lebensfreude.',
  about_ethics_title: 'Unsere Verantwortung',
  about_p_ethics:
    'Wir glauben an Fairness. Deshalb arbeiten wir direkt mit Kleinbauern zusammen, zahlen Preise weit über dem Weltmarktniveau und unterstützen Erntemethoden, die die tropische Natur bewahren.',
  flavors_sub: 'Die Expedition',
  flavors_h2: 'Unsere 6 Eissorten',
  flavors_p: 'Wöchentlich aktualisiert mit saisonalen Experimenten.',
  badge_sig: 'SIGNATURE',
  badge_new: 'NEU',
  badge_best: 'Bestseller',
  badge_vegan: 'Vegan',
  badge_energy: 'Energy',
  badge_seasonal: 'Saisonal',
  f1_h: 'Berlin Tropical',
  f1_p: 'Wilde Waldbeeren aus Brandenburg verschmelzen mit einer cremigen Basis aus Guave.',
  f2_h: 'Tropen-Kakao',
  f2_p: 'Edler Kakao mit Meersalz und Tonkabohne. Tief, dunkel und exotisch.',
  f3_h: 'Mango & Chili',
  f3_p: 'Süße Alphonso-Mango mit einem Kick aus Chili. Die perfekte Balance.',
  f4_h: 'Kokos Wolke',
  f4_p: 'Cremige Kokosmilch mit gerösteten Kokosflocken. Pure Seligkeit.',
  f5_h: 'Tropical Açaí',
  f5_p: 'Echte Açaí-Beere mit natürlichem Guaraná. Ein Kraftschub für den Tag.',
  f6_h: 'Maracuja Punch',
  f6_p: 'Saure Maracuja trifft auf zarte weiße Schokoladen-Splits. Erfrischend spritzig.',
  footer_h2: 'Besuche die Oase',
  footer_loc: 'Standort',
  footer_address: 'Rosenthaler Str. 40, 10119 Berlin',
  footer_club: 'Tropical Club',
  footer_p: 'Exklusive Angebote und neue Sorten.',
  footer_email: 'Deine E-Mail',
  footer_btn: 'Abonnieren',
};

export type TranslationKey = keyof typeof de;

const en: Record<TranslationKey, string> = {
  logo_subtitle: 'Gelato',
  nav_history: 'Our Story',
  nav_flavors: 'Flavors',
  nav_location: 'Location',
  nav_order: 'Order Now',
  hero_badge: 'SINCE 2024',
  hero_h1_p1: 'A',
  hero_h1_span: 'Vacation',
  hero_h1_p2: 'in every scoop.',
  hero_p:
    'We bring the vibrant heat of the tropics to the heart of Berlin. Handcrafted gelato inspired by exotic lands.',
  btn_flavors: 'Explore Flavors',
  btn_visit: 'Visit our Oasis',
  about_h2: 'From the Tropics straight to Berlin',
  about_p1:
    'It all started with a journey to distant, exotic lands. We fell in love with the colors, the energy, and above all, the taste of tropical fruits.',
  about_p2:
    'Tropical is our answer to Berlin winter days – a fusion of urban lifestyle and pure tropical joy.',
  about_ethics_title: 'Our Responsibility',
  about_p_ethics:
    "We believe in fairness. That's why we work directly with small farmers, paying prices far above the global market level and supporting harvesting methods that preserve tropical nature.",
  flavors_sub: 'The Expedition',
  flavors_h2: 'Our 6 Flavors',
  flavors_p: 'Updated weekly with seasonal experiments.',
  badge_sig: 'SIGNATURE',
  badge_new: 'NEW',
  badge_best: 'Bestseller',
  badge_vegan: 'Vegan',
  badge_energy: 'Energy',
  badge_seasonal: 'Seasonal',
  f1_h: 'Berlin Tropical',
  f1_p: 'Wild forest berries from Brandenburg merge with a creamy Guava base.',
  f2_h: 'Tropical Cocoa',
  f2_p: 'Fine cocoa with sea salt and tonka bean. Deep, dark and exotic.',
  f3_h: 'Mango & Chili',
  f3_p: 'Sweet Alphonso mango with a kick of chili. The perfect balance.',
  f4_h: 'Coconut Cloud',
  f4_p: 'Creamy coconut milk with toasted coconut flakes. Pure bliss.',
  f5_h: 'Tropical Açaí',
  f5_p: 'Real Açaí berry with natural Guaraná. A power boost for your day.',
  f6_h: 'Maracuja Punch',
  f6_p: 'Sour passionfruit meets delicate white chocolate splits. Refreshingly vibrant.',
  footer_h2: 'Visit the Oasis',
  footer_loc: 'Location',
  footer_address: 'Rosenthaler Str. 40, 10119 Berlin',
  footer_club: 'Tropical Club',
  footer_p: 'Exclusive offers and new flavor drops.',
  // The original page kept the German placeholder in both languages.
  footer_email: 'Deine E-Mail',
  footer_btn: 'Subscribe',
};

export const translations: Record<Lang, Record<TranslationKey, string>> = { de, en };

export interface Flavor {
  emoji: string;
  name: TranslationKey;
  description: TranslationKey;
  badge: TranslationKey;
  cardClass: string;
  imageClass: string;
  nameClass: string;
  badgeClass: string;
}

const outlineBadge = 'text-[10px] px-2 py-1 rounded uppercase font-bold border';

export const flavors: readonly Flavor[] = [
  {
    emoji: '🍍',
    name: 'f1_h',
    description: 'f1_p',
    badge: 'badge_sig',
    cardClass: 'border-accent-green/30 hover:border-accent-green',
    imageClass: 'bg-accent-green/10',
    nameClass: 'text-accent-green',
    badgeClass: 'badge-signature',
  },
  {
    emoji: '🍫',
    name: 'f2_h',
    description: 'f2_p',
    badge: 'badge_new',
    cardClass: 'border-neon-pink/30 hover:border-neon-pink',
    imageClass: 'bg-amber-900/40',
    nameClass: 'text-neon-pink',
    badgeClass: 'bg-neon-pink text-white text-[10px] font-bold px-2 py-1 rounded uppercase',
  },
  {
    emoji: '🥭',
    name: 'f3_h',
    description: 'f3_p',
    badge: 'badge_best',
    cardClass: 'border-white/10 hover:border-accent-green',
    imageClass: 'bg-orange-500/30',
    nameClass: 'text-white',
    badgeClass: 'badge-signature opacity-80',
  },
  {
    emoji: '🥥',
    name: 'f4_h',
    description: 'f4_p',
    badge: 'badge_vegan',
    cardClass: 'border-white/10 hover:border-white/30',
    imageClass: 'bg-stone-100/10',
    nameClass: 'text-white',
    badgeClass: `${outlineBadge} border-accent-green text-accent-green`,
  },
  {
    emoji: '🫐',
    name: 'f5_h',
    description: 'f5_p',
    badge: 'badge_energy',
    cardClass: 'border-white/10 hover:border-white/30',
    imageClass: 'bg-purple-900/30',
    nameClass: 'text-white',
    badgeClass: `${outlineBadge} border-white/40 text-white`,
  },
  {
    emoji: '🍹',
    name: 'f6_h',
    description: 'f6_p',
    badge: 'badge_seasonal',
    cardClass: 'border-white/10 hover:border-white/30',
    imageClass: 'bg-pink-500/20',
    nameClass: 'text-white',
    badgeClass: `${outlineBadge} border-neon-pink text-neon-pink`,
  },
];

export const aboutTiles: readonly { emoji: string; class: string }[] = [
  { emoji: '🌴', class: 'bg-tropical' },
  { emoji: '🍦', class: 'bg-neon-pink/10' },
  { emoji: '🦜', class: 'bg-accent-green/10' },
  { emoji: '🥥', class: 'bg-tropical' },
];
