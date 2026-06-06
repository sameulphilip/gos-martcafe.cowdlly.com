/** Verified working Unsplash photo IDs (tested HTTP 200) */
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&h=600&q=80`;

export const FALLBACK_IMAGE = UNSPLASH("1554118811-1e0d58224f24");

export const productImages = {
  coffee: UNSPLASH("1495474472287-4d71bcdd2085"),
  espresso: UNSPLASH("1509042239860-f550ce710b93"),
  latte: UNSPLASH("1572442388796-11668a67e53d"),
  turkishCoffee: UNSPLASH("1514432324607-a09d9b4aefdd"),
  mocha: UNSPLASH("1578662996442-48f60103fc96"),
  icedCoffee: UNSPLASH("1461023058943-07fcbe16d735"),
  frappe: UNSPLASH("1461023058943-07fcbe16d735"),
  hotChocolate: UNSPLASH("1578662996442-48f60103fc96"),
  mojito: UNSPLASH("1544145945-f90425340c7e"),
  tea: UNSPLASH("1556679343-c7306c1976bc"),
  hotDrink: UNSPLASH("1544787219-7f47ccb76574"),
  mangoJuice: UNSPLASH("1600271886742-f049cd451bba"),
  fruitJuice: UNSPLASH("1512621776951-a57141f2eefd"),
  smoothie: UNSPLASH("1512621776951-a57141f2eefd"),
  icedTea: UNSPLASH("1556679343-c7306c1976bc"),
  matcha: UNSPLASH("1512621776951-a57141f2eefd"),
  softDrink: UNSPLASH("1544145945-f90425340c7e"),
  energyDrink: UNSPLASH("1544145945-f90425340c7e"),
  water: UNSPLASH("1544145945-f90425340c7e"),
  cheesecake: UNSPLASH("1524351199678-941a58a3df50"),
  brownie: UNSPLASH("1558618666-fcd25c85cd64"),
  tiramisu: UNSPLASH("1571877227200-a0d98ea607e9"),
  dessert: UNSPLASH("1551024506-0bccd828d307"),
  waffle: UNSPLASH("1562376552-0d160a2f238d"),
  savoryWaffle: UNSPLASH("1546069901-ba9599a7e63c"),
  croissant: UNSPLASH("1555507036-ab1f4038808a"),
  potato: UNSPLASH("1565299624946-b28f40a0ae38"),
  sandwich: UNSPLASH("1551782450-a2132b4ba21d"),
  snacks: UNSPLASH("1578849278619-e73505e9610f"),
  mart: UNSPLASH("1604719312566-8912e9227c6a"),
  noodles: UNSPLASH("1546069901-ba9599a7e63c"),
  chocolate: UNSPLASH("1558618666-fcd25c85cd64"),
  cookies: UNSPLASH("1558618666-fcd25c85cd64"),
} as const;

type ImageRule = {
  match: (name: string, category: string) => boolean;
  image: string;
};

const imageRules: ImageRule[] = [
  { match: (n) => n.includes("turkish"), image: productImages.turkishCoffee },
  { match: (n, c) => c.includes("iced drinks"), image: productImages.icedCoffee },
  { match: (n) => n.includes("espresso") && n.includes("macchiato"), image: productImages.latte },
  { match: (n) => n.includes("espresso"), image: productImages.espresso },
  { match: (n) => n.includes("americano"), image: productImages.coffee },
  { match: (n) => n.includes("cortado") || n.includes("flat white"), image: productImages.latte },
  { match: (n) => n.includes("cappuccino"), image: productImages.latte },
  { match: (n) => n.includes("caramel"), image: productImages.latte },
  { match: (n) => n.includes("spanish latte"), image: productImages.latte },
  { match: (n) => n.includes("mocha"), image: productImages.mocha },
  { match: (n) => n.includes("latte"), image: productImages.latte },
  { match: (n) => n.includes("hot chocolate") || n.includes("ice chocolate"), image: productImages.hotChocolate },
  { match: (n, c) => c.includes("frappe"), image: productImages.frappe },
  { match: (n) => n.includes("louts") || n.includes("lotus"), image: productImages.dessert },
  { match: (n) => n.includes("blended") || n.includes("blanded"), image: productImages.frappe },
  { match: (n) => n.includes("mojito"), image: productImages.mojito },
  { match: (n) => n === "tea", image: productImages.tea },
  { match: (n) => n.includes("sider") || n.includes("sahlab") || n.includes("harbs"), image: productImages.hotDrink },
  { match: (n, c) => c.includes("fresh juice") && n.includes("mango"), image: productImages.mangoJuice },
  { match: (n, c) => c.includes("fresh juice"), image: productImages.fruitJuice },
  { match: (n, c) => c.includes("smoothie") && n.includes("pina"), image: productImages.fruitJuice },
  { match: (n, c) => c.includes("smoothie"), image: productImages.smoothie },
  { match: (n, c) => c.includes("ice tea"), image: productImages.icedTea },
  { match: (n) => n.includes("matcha"), image: productImages.matcha },
  { match: (n) => n.includes("cola") || n.includes("soda"), image: productImages.softDrink },
  { match: (n) => n.includes("red bull") || n.includes("redbull") || n.includes("monster"), image: productImages.energyDrink },
  { match: (n) => n.includes("water"), image: productImages.water },
  { match: (n) => n.includes("cheese cake"), image: productImages.cheesecake },
  { match: (n) => n.includes("browine") || n.includes("brownie"), image: productImages.brownie },
  { match: (n) => n.includes("tiramisu"), image: productImages.tiramisu },
  { match: (n) => n.includes("molten") || n.includes("marble"), image: productImages.dessert },
  { match: (n) => n.includes("nutella") || n.includes("oreo"), image: productImages.waffle },
  { match: (n) => n.includes("pistachio") || n.includes("four seasons"), image: productImages.waffle },
  { match: (n, c) => c.includes("waffle") && (n.includes("tuna") || n.includes("turkey") || n.includes("potato")), image: productImages.savoryWaffle },
  { match: (n, c) => c.includes("waffle"), image: productImages.waffle },
  { match: (n, c) => c.includes("croissant"), image: productImages.croissant },
  { match: (n, c) => c.includes("potato"), image: productImages.potato },
  { match: (n) => n.includes("indomi"), image: productImages.noodles },
  { match: (n) => n.includes("chipsy") || n.includes("twist"), image: productImages.snacks },
  { match: (n) => n.includes("pop corn") || n.includes("popcorn"), image: productImages.snacks },
  { match: (n) => n.includes("oreo"), image: productImages.cookies },
  { match: (n) => n.includes("choco"), image: productImages.chocolate },
  { match: (n, c) => c.includes("markat"), image: productImages.mart },
  { match: (n, c) => c.includes("desserts"), image: productImages.dessert },
];

const categoryFallbacks: Record<string, string> = {
  "classic COFFEE": productImages.coffee,
  "ICED DRINKS": productImages.icedCoffee,
  "COFFEE FRAPPE": productImages.frappe,
  "NON COFFEE FRAPPE": productImages.frappe,
  MOJITO: productImages.mojito,
  "HOT DRINK": productImages.hotDrink,
  "FRESH JUICE": productImages.fruitJuice,
  SMOOTHIE: productImages.smoothie,
  "ICE TEA": productImages.icedTea,
  MATCHA: productImages.matcha,
  "SOFT DRINK": productImages.softDrink,
  DESSERTS: productImages.dessert,
  "SWEET WAFFLE": productImages.waffle,
  "DEFFERENT WAFFLE": productImages.savoryWaffle,
  "Croissant Corner": productImages.croissant,
  "POTATO CORNER": productImages.potato,
  markat: productImages.mart,
};

export const categoryImages: Record<string, string> = {
  "classic COFFEE": productImages.coffee,
  "ICED DRINKS": productImages.icedCoffee,
  "COFFEE FRAPPE": productImages.frappe,
  "NON COFFEE FRAPPE": productImages.frappe,
  MOJITO: productImages.mojito,
  "HOT DRINK": productImages.hotDrink,
  "FRESH JUICE": productImages.mangoJuice,
  SMOOTHIE: productImages.smoothie,
  "ICE TEA": productImages.icedTea,
  MATCHA: productImages.matcha,
  "SOFT DRINK": productImages.softDrink,
  DESSERTS: productImages.dessert,
  "SWEET WAFFLE": productImages.waffle,
  "DEFFERENT WAFFLE": productImages.savoryWaffle,
  "Croissant Corner": productImages.croissant,
  "POTATO CORNER": productImages.potato,
  markat: productImages.mart,
};

export function getItemImage(name: string, category: string): string {
  const normalizedName = name.toLowerCase().trim();
  const normalizedCategory = category.toLowerCase().trim();

  for (const rule of imageRules) {
    if (rule.match(normalizedName, normalizedCategory)) {
      return rule.image;
    }
  }

  for (const [cat, image] of Object.entries(categoryFallbacks)) {
    if (cat.toLowerCase() === normalizedCategory) {
      return image;
    }
  }

  return FALLBACK_IMAGE;
}

export function getCategoryImage(name: string): string {
  return categoryImages[name] ?? FALLBACK_IMAGE;
}
