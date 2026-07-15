import { useEffect, useState } from "react";

export const useScrolled = (ref: React.RefObject<HTMLElement | null>): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const handler = () => setIsScrolled(el.scrollTop > 0);

    el.addEventListener("scroll", handler, { passive: true });

    return () => el.removeEventListener("scroll", handler);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isScrolled;
};
