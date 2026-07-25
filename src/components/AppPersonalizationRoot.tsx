import { useEffect } from "react";
import {
  applyBackground,
  applyPalette,
  readPersonalization,
  subscribePersonalization,
  pushHistory,
} from "@/lib/appPersonalization";
import { useRouter } from "@tanstack/react-router";

/**
 * Mounts once at the root: applies the current AI-generated background &
 * palette on mount, re-applies whenever they change, and records navigation
 * history for the Historique panel.
 */
export default function AppPersonalizationRoot() {
  const router = useRouter();

  useEffect(() => {
    const p = readPersonalization();
    applyPalette(p.palette);
    applyBackground(p.bgUrl);
    if (p.darkMode === false) document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");

    const unsub = subscribePersonalization((next) => {
      applyPalette(next.palette);
      applyBackground(next.bgUrl);
      if (next.darkMode === false) document.documentElement.classList.remove("dark");
      else document.documentElement.classList.add("dark");
    });
    return unsub;
  }, []);

  useEffect(() => {
    const un = router.subscribe("onResolved", ({ toLocation }) => {
      const p = toLocation.pathname;
      if (p && p !== "/") pushHistory(p, document.title);
    });
    return un;
  }, [router]);

  return null;
}
