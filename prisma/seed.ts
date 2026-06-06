import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";
import { getCategoryImage, getItemImage } from "../src/lib/item-images";

const prisma = new PrismaClient();

type MenuDataFile = {
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


function loadMenuData(): MenuDataFile {
  const filePath = join(process.cwd(), "prisma", "menu-data.json");
  return JSON.parse(readFileSync(filePath, "utf-8")) as MenuDataFile;
}

async function main() {
  const menuData = loadMenuData();

  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.create({
    data: { email: "admin@gosmart.com", passwordHash },
  });

  const categoryIds = new Map<string, string>();
  let sortOrder = 0;

  for (const categoryName of menuData.categories) {
    const itemCount = menuData.items.filter((i) => i.category === categoryName).length;
    if (itemCount === 0) continue;

    const category = await prisma.category.create({
      data: {
        name: categoryName,
        sortOrder: sortOrder++,
        image: getCategoryImage(categoryName),
      },
    });
    categoryIds.set(categoryName, category.id);
  }

  for (const item of menuData.items) {
    const categoryId = categoryIds.get(item.category);
    if (!categoryId) continue;

    await prisma.item.create({
      data: {
        name: item.name,
        description: null,
        price: item.price,
        size: item.size,
        image: item.image ?? getItemImage(item.name, item.category),
        categoryId,
        isAvailable: true,
        tags: [],
      },
    });
  }

  console.log("✅ Menu imported from Excel data");
  console.log(`📂 ${categoryIds.size} categories · ${menuData.items.length} items`);
  console.log("📧 Admin: admin@gosmart.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
