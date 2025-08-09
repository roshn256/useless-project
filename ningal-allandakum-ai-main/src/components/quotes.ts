const QUOTES = [
  "🔥 Visham undenkil… ningal ningal allandakum!",
  "Ee mugham kandappo… pazhaya data okke panic ayi!",
  "Calm aakaam enn thonniyalo? Adhikam visham aanu!",
  "Snack kazhicho? Illenkil ithu pole thanne roast kittum!",
  "Thalarchha? Chocolate undengil mathi—vikarum kurayum.",
  "Ivide oru Snickers venam… athu sherikkum science aanu.",
  "Mood detect cheythu: ‘hungry code pathi vilikkunnu’.",
  "Neram kazhinju. Ningal ‘you’ alla ipo. Ariyo?",
  "Visham + Deadline = World War III. Paalu paalum chocolate um. ",
  "Snack venam. Appol mathram ningal calm mode il."
];

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export { QUOTES };
