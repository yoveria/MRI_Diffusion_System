import { useCallback, useEffect, useMemo, useState } from "react";

const OBSERVER_ROOT_MARGIN = "-96px 0px -55% 0px";
const OBSERVER_THRESHOLDS = [0.2, 0.4, 0.6];

type ScrollSpyOptions<T extends string> = {
  sectionIds: readonly T[];
  headerSelector: string;
};

type ScrollSpyResult<T extends string> = {
  activeSection: T;
  scrollToSection: (sectionId: T) => void;
};

const getHeaderOffset = (selector: string): number => {
  const header = document.querySelector<HTMLElement>(selector);
  return header?.getBoundingClientRect().height ?? 88;
};

export const useScrollSpy = <T extends string>({
  sectionIds,
  headerSelector,
}: ScrollSpyOptions<T>): ScrollSpyResult<T> => {
  const fallbackSection = sectionIds[0];

  const sectionOrder = useMemo(() => {
    const mapping = new Map<T, number>();
    sectionIds.forEach((id, index) => mapping.set(id, index));
    return mapping;
  }, [sectionIds]);

  const getSectionByAnchor = useCallback((): T => {
    const anchorLine = window.scrollY + getHeaderOffset(headerSelector) + 24;
    let nextSection = fallbackSection;

    sectionIds.forEach((id) => {
      const sectionNode = document.getElementById(id);
      if (sectionNode && sectionNode.offsetTop <= anchorLine) {
        nextSection = id;
      }
    });

    return nextSection;
  }, [fallbackSection, headerSelector, sectionIds]);

  const [activeSection, setActiveSection] = useState<T>(() => {
    if (typeof window === "undefined") {
      return fallbackSection;
    }

    const hashId = window.location.hash.replace("#", "") as T;
    if (sectionIds.includes(hashId)) {
      return hashId;
    }

    return fallbackSection;
  });

  const replaceHash = useCallback((sectionId: T) => {
    if (typeof window === "undefined") {
      return;
    }

    const nextHash = `#${sectionId}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, []);

  const scrollToSection = useCallback(
    (sectionId: T) => {
      setActiveSection(sectionId);
      replaceHash(sectionId);

      const target = document.getElementById(sectionId);
      if (!target) {
        return;
      }

      const offset = getHeaderOffset(headerSelector) + 12;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    },
    [headerSelector, replaceHash],
  );

  useEffect(() => {
    replaceHash(activeSection);
  }, [activeSection, replaceHash]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("IntersectionObserver" in window) {
      const visibleEntries = new Map<T, IntersectionObserverEntry>();
      let rafId = 0;

      const updateByAnchor = () => {
        const next = getSectionByAnchor();
        setActiveSection((previous) => (previous === next ? previous : next));
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id as T;
            if (!sectionOrder.has(id)) {
              return;
            }

            if (entry.isIntersecting && entry.intersectionRatio > 0) {
              visibleEntries.set(id, entry);
            } else {
              visibleEntries.delete(id);
            }
          });

          if (visibleEntries.size === 0) {
            updateByAnchor();
            return;
          }

          const nextActive = [...visibleEntries.entries()]
            .sort((left, right) => {
              const ratioDiff = right[1].intersectionRatio - left[1].intersectionRatio;
              if (ratioDiff !== 0) {
                return ratioDiff;
              }

              const leftOrder = sectionOrder.get(left[0]) ?? Number.MAX_SAFE_INTEGER;
              const rightOrder = sectionOrder.get(right[0]) ?? Number.MAX_SAFE_INTEGER;
              return leftOrder - rightOrder;
            })
            .at(0)?.[0];

          if (nextActive) {
            setActiveSection((previous) => (previous === nextActive ? previous : nextActive));
          }
        },
        {
          root: null,
          rootMargin: OBSERVER_ROOT_MARGIN,
          threshold: OBSERVER_THRESHOLDS,
        },
      );

      sectionIds.forEach((id) => {
        const sectionNode = document.getElementById(id);
        if (sectionNode) {
          observer.observe(sectionNode);
        }
      });

      const onScrollOrResize = () => {
        if (rafId !== 0) {
          return;
        }

        rafId = window.requestAnimationFrame(() => {
          if (visibleEntries.size === 0) {
            updateByAnchor();
          }
          rafId = 0;
        });
      };

      window.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("resize", onScrollOrResize);
      updateByAnchor();

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", onScrollOrResize);
        window.removeEventListener("resize", onScrollOrResize);
        if (rafId !== 0) {
          window.cancelAnimationFrame(rafId);
        }
      };
    }

    let rafId = 0;

    const computeActiveByScroll = () => {
      const nextSection = getSectionByAnchor();
      setActiveSection((previous) => (previous === nextSection ? previous : nextSection));
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId !== 0) {
        return;
      }

      rafId = window.requestAnimationFrame(computeActiveByScroll);
    };

    computeActiveByScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [getSectionByAnchor, sectionIds, sectionOrder]);

  return {
    activeSection,
    scrollToSection,
  };
};
