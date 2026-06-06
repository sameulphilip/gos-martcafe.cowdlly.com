import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { getItemImage } from "../src/lib/item-images";

type MenuData = {
  categories: string[];
  items: {
    category: string;
    name: string;
    price: number;
    size: string | null;
    description: string | null;
    image?: string;
  }[];
};

const menuPath = join(process.cwd(), "prisma", "menu-data.json");
const menu: MenuData = JSON.parse(readFileSync(menuPath, "utf-8"));

menu.items = menu.items.map((item) => ({
  ...item,
  image: getItemImage(item.name, item.category),
}));

writeFileSync(menuPath, JSON.stringify(menu, null, 2), "utf-8");

console.log(`✅ Added images to ${menu.items.length} items`);
