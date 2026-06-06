import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
  }
}

export type CategoryWithCount = {
  id: string;
  name: string;
  image: string | null;
  sortOrder: number;
  createdAt: Date;
  _count?: { items: number };
};

export type ItemWithCategory = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  size: string | null;
  image: string | null;
  categoryId: string;
  isAvailable: boolean;
  tags: string[];
  createdAt: Date;
  category?: {
    id: string;
    name: string;
  };
};

export type MenuData = {
  categories: CategoryWithCount[];
  items: ItemWithCategory[];
};
