export const MART_INTRO_TITLE = "✨ أهلاً بيكم في GO'S MART ✨";

export const MART_SUBTITLE = "كافيه وماركت للطلاب";

export const MART_INTRO_LEAD =
  "إحنا هنا مش مجرد كافيه… إحنا المكان اللي معمول مخصوص عشان يظبط مزاج الطلاب ☕📚";

export const MART_INTRO_PARAGRAPHS = [
  "وفرنالكوا جو هادي ومريح يساعدكم تركزوا وتذاكروا براحتكم، مع كل اللي نفسكم فيه من مشروبات وأكل بأعلى جودة وطعم يخلي يومكم أحسن ❤️",
  "ولو محتاجين تفصلوا شوية بعد يوم دراسي طويل؟ مفيش مشكلة 😎\nعندنا كمان مساحة للعب والترفيه عشان تخرجوا الطاقة وتنبسطوا مع صحابكم 🎮✨",
] as const;

export const MART_INTRO_SUMMARY =
  "في GO'S MART هتلاقي كل حاجة في مكان واحد: مذاكرة، هدوء، قهوة مظبوطة، أكل حلو، لعب، وراحة نفسية 💙";

export const MART_VIBES = ["مذاكرة", "هدوء", "قهوة", "أكل", "لعب", "راحة"] as const;

export const MART_QUOTE =
  "بعد يومك الدراسي… تعالى اقعد، خد مشروبك، وفكّر انت عايز تعمل إيه 😉";

/** @deprecated use MART_INTRO_SUMMARY — kept for QR backward compat */
export const MART_TAGLINE = MART_INTRO_SUMMARY;

/** @deprecated kept for QR print layout */
export const MART_STORY = [
  { emoji: "☕", text: MART_INTRO_LEAD },
  { emoji: "❤️", text: MART_INTRO_PARAGRAPHS[0] },
  { emoji: "🎮", text: MART_INTRO_PARAGRAPHS[1].replace("\n", " ") },
] as const;
