import { useCallback, useEffect, useMemo, useState } from "react";
import { Features } from "./components/LandingFeatures";
import { FooterCTA } from "./components/LandingFooterCTA";
import { Header } from "./components/LandingHeader";
import { Hero } from "./components/LandingHero";
import { Reliability } from "./components/LandingReliability";
import { Scenarios } from "./components/LandingScenarios";
import { DemoWorkbench } from "./components/demo/DemoWorkbench";
import { ROUTE_NAV_ITEMS, ROUTE_PATHS, pathToRouteKey, type RouteKey } from "./constants/routes";

const setPagePath = (path: string) => {
  const currentPath = window.location.pathname;
  if (currentPath === path) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  window.history.pushState({}, "", path);
  window.scrollTo({ top: 0, behavior: "auto" });
};

const PageContent = ({ routeKey, onPrimaryAction, onSecondaryAction }: { routeKey: RouteKey; onPrimaryAction: () => void; onSecondaryAction: () => void }) => {
  switch (routeKey) {
    case "home":
      return <Hero onPrimaryAction={onPrimaryAction} onSecondaryAction={onSecondaryAction} />;
    case "capabilities":
      return <Features />;
    case "reliability":
      return <Reliability />;
    case "scenarios":
      return <Scenarios />;
    case "demo":
      return <DemoWorkbench />;
    default:
      return <Hero onPrimaryAction={onPrimaryAction} onSecondaryAction={onSecondaryAction} />;
  }
};

const App = () => {
  const [routeKey, setRouteKey] = useState<RouteKey>(() => pathToRouteKey(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setRouteKey(pathToRouteKey(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((id: RouteKey) => {
    const nextPath = ROUTE_PATHS[id];
    setPagePath(nextPath);
    setRouteKey(id);
  }, []);

  const handleStartExperience = useCallback(() => {
    navigate("demo");
  }, [navigate]);

  const handleShowReliability = useCallback(() => {
    navigate("reliability");
  }, [navigate]);

  const pageTitle = useMemo(() => {
    const current = ROUTE_NAV_ITEMS.find((item) => item.id === routeKey);
    return current?.label ?? "首页";
  }, [routeKey]);

  useEffect(() => {
    document.title = `${pageTitle} | MRI Diffusion System`;
  }, [pageTitle]);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Header navItems={ROUTE_NAV_ITEMS} activeRoute={routeKey} onNavigate={navigate} onPrimaryAction={handleStartExperience} />

      <main className="relative mx-auto w-full max-w-6xl space-y-20 px-4 pb-16 pt-24 md:px-6 md:pt-28">
        <PageContent routeKey={routeKey} onPrimaryAction={handleStartExperience} onSecondaryAction={handleShowReliability} />
      </main>

      <FooterCTA onPrimaryAction={handleStartExperience} onSecondaryAction={handleShowReliability} onNavClick={navigate} />
    </div>
  );
};

export default App;
