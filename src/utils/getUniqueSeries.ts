import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Series {
  series: string;
  seriesName: string;
  count: number;
}

const getUniqueSeries = (posts: CollectionEntry<"blog">[]): Series[] => {
  const filtered = posts.filter(postFilter).filter(post => post.data.series);

  const map = new Map<string, Series>();
  for (const post of filtered) {
    const s = post.data.series!;
    const key = slugifyStr(s);
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { series: key, seriesName: s, count: 1 });
    }
  }

  return [...map.values()].sort((a, b) => a.series.localeCompare(b.series));
};

export default getUniqueSeries;
