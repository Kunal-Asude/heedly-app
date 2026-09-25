import { useEffect, useState } from "react";
import HeedlyNative from "@heedly/native";
import type { Tag } from "@heedly/native";
import type { CheckInCategory, TagOption } from "@/types/checkin";

/**
 * The tag vocabulary, read from the engine.
 *
 * The engine owns it (`TagCatalog.swift`). Keeping a second list here is what
 * let the two drift: a tag the engine could not resolve contributed nothing to
 * load and said nothing about it.
 */

/** Display names for the six categories. The engine sends raw values. */
const CATEGORY_LABELS: Record<string, string> = {
  activity: "Activities",
  mind_mood: "Mind & mood",
  environment: "Environment",
  symptoms: "Symptoms",
  body_cycle: "Body",
  other: "Other",
};

function toCategories(tags: Tag[]): CheckInCategory[] {
  const order: string[] = [];
  const grouped = new Map<string, TagOption[]>();

  // Catalogue order decides category order, so the engine stays the only place
  // this is arranged.
  for (const tag of tags) {
    if (!grouped.has(tag.category)) {
      grouped.set(tag.category, []);
      order.push(tag.category);
    }
    grouped.get(tag.category)!.push({ id: tag.id, label: tag.label });
  }

  return order.map((category) => ({
    id: category,
    label: CATEGORY_LABELS[category] ?? category,
    tags: grouped.get(category) ?? [],
  }));
}

export function useTagCatalogue() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    HeedlyNative.getTagCatalogue().then(
      (catalogue) => {
        if (!isMounted) return;
        setTags(catalogue);
        setIsLoaded(true);
      },
      (error: unknown) => {
        // No fallback to a local list. A second source is what this replaces,
        // and an empty cloud is honest where a stale one is not.
        console.warn("[tags] could not read the catalogue:", error);
        if (isMounted) setIsLoaded(true);
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories: toCategories(tags),
    allTags: tags.map((tag) => ({ id: tag.id, label: tag.label })),
    isLoaded,
  };
}
