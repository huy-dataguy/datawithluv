import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Category {
  category: string;
  categoryName: string;
  count: number;
}

const getUniqueCategories = (posts: CollectionEntry<"blog">[]): Category[] => {
  const filtered = posts.filter(postFilter).filter(post => post.data.category);

  const map = new Map<string, Category>();
  for (const post of filtered) {
    const cat = post.data.category!;
    const key = slugifyStr(cat);
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { category: key, categoryName: cat, count: 1 });
    }
  }

  return [...map.values()].sort((a, b) => a.category.localeCompare(b.category));
};

export default getUniqueCategories;
