import { useEffect, useMemo, useRef, useState } from "react";

export default function useInfiniteFeed({
  items,
  initialCount = 9,
  step = 6,
  resetKey = "",
  rootMargin = "280px",
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [initialCount, resetKey]);

  useEffect(() => {
    if (visibleCount > safeItems.length) {
      setVisibleCount(safeItems.length);
    }
  }, [safeItems.length, visibleCount]);

  const hasMore = visibleCount < safeItems.length;

  useEffect(() => {
    if (!hasMore) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisibleCount((current) => Math.min(current + step, safeItems.length));
      },
      { rootMargin }
    );

    const node = sentinelRef.current;
    if (node) observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, rootMargin, safeItems.length, step]);

  const visibleItems = useMemo(
    () => safeItems.slice(0, visibleCount),
    [safeItems, visibleCount]
  );

  return {
    visibleItems,
    hasMore,
    sentinelRef,
    visibleCount,
    totalCount: safeItems.length,
  };
}
