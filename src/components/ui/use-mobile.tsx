import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Vérifier au premier chargement
    const checkMobile = () => {
      const result = window.matchMedia("(max-width: 1024px)").matches;
      setIsMobile(result);
    };
    
    checkMobile();

    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
