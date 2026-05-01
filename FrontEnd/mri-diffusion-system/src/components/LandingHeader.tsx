import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { RouteKey, RouteNavItem } from "../constants/routes";

type HeaderProps = {
  navItems: RouteNavItem[];
  activeRoute: RouteKey;
  onNavigate: (id: RouteKey) => void;
  onPrimaryAction: () => void;
};

export const Header = ({ navItems, activeRoute, onNavigate, onPrimaryAction }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const handleNavClick = (id: RouteKey) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const navButtonClass = (id: RouteKey): string => {
    const isActive = activeRoute === id;

    return [
      "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      isActive
        ? "bg-primary text-surface shadow-soft"
        : "text-muted hover:bg-primary/10 hover:text-text",
    ].join(" ");
  };

  return (
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-surface/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={() => handleNavClick("home")}
          className="text-left font-serif text-lg font-semibold tracking-wide text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          MRI Diffusion System
        </button>

        <nav className="hidden items-center gap-2 rounded-full border border-border bg-surface/80 p-1 md:flex" aria-label="主导航">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={navButtonClass(item.id)}
              aria-current={activeRoute === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-surface shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            立即体验
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((previous) => !previous)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-label="切换导航菜单"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-border/80 bg-surface/95 px-4 pb-4 pt-3 shadow-soft md:hidden">
          <nav className="flex flex-col gap-2" aria-label="移动端导航">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={navButtonClass(item.id)}
                aria-current={activeRoute === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              onPrimaryAction();
              setIsMobileMenuOpen(false);
            }}
            className="mt-3 w-full rounded-full bg-primary px-5 py-2 text-sm font-semibold text-surface shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            立即体验
          </button>
        </div>
      ) : null}
    </header>
  );
};
