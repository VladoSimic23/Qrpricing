const MENU_CACHE_TAG_PREFIX = "menu";

export const MENU_REVALIDATE_SECONDS = 60 * 60 * 2;

export function getMenuCacheTag(slug: string) {
  return `${MENU_CACHE_TAG_PREFIX}:${slug}`;
}
