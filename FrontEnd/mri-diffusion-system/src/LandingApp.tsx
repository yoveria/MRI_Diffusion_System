import { useCallback } from "react";
import { Features } from "./components/LandingFeatures";
import { FooterCTA } from "./components/LandingFooterCTA";
import { Guide } from "./components/LandingGuide";
import { Header } from "./components/LandingHeader";
import { Hero } from "./components/LandingHero";
import { Scenarios } from "./components/LandingScenarios";
import { DemoWorkbench } from "./components/demo/DemoWorkbench";
import { navItems, type SectionId } from "./constants/site";
import { useScrollSpy } from "./hooks/useScrollSpy";

const sectionIds: SectionId[] = navItems.map((item) => item.id);

const App = () => {
  const { activeSection, scrollToSection } = useScrollSpy<SectionId>({
    sectionIds,
    headerSelector: "#site-header",
  });

  const scrollToId = useCallback(
    (id: string) => {
      if (sectionIds.includes(id as SectionId)) {
        scrollToSection(id as SectionId);
        return;
      }

      const target = document.getElementById(id);
      if (!target) {
        return;
      }

      const header = document.querySelector<HTMLElement>("#site-header");
      const offset = (header?.getBoundingClientRect().height ?? 88) + 12;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
      window.history.replaceState(null, "", `#${id}`);
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    },
    [scrollToSection],
  );

  const handleStartExperience = useCallback(() => {
    scrollToId("demo");
  }, [scrollToId]);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Header
        navItems={navItems}
        activeSection={activeSection}
        onNavClick={scrollToSection}
        onPrimaryAction={handleStartExperience}
      />

      <main className="relative mx-auto w-full max-w-6xl space-y-20 px-4 pb-16 pt-24 md:px-6 md:pt-28">
        <Hero onPrimaryAction={handleStartExperience} onSecondaryAction={() => scrollToSection("guide")} />
        <Features />
        <Scenarios />
        <Guide onPrimaryAction={handleStartExperience} />
        <DemoWorkbench />
      </main>

      <FooterCTA onPrimaryAction={handleStartExperience} onNavClick={scrollToSection} />
    </div>
  );
};

export default App;
