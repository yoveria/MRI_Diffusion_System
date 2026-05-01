export type RouteKey = "home" | "capabilities" | "reliability" | "scenarios" | "demo";

export type RouteNavItem = {
  id: RouteKey;
  label: string;
  path: string;
};

export const ROUTE_PATHS: Record<RouteKey, string> = {
  home: "/",
  capabilities: "/features",
  reliability: "/reliability",
  scenarios: "/scenarios",
  demo: "/demo",
};

export const ROUTE_NAV_ITEMS: RouteNavItem[] = [
  { id: "home", label: "首页", path: ROUTE_PATHS.home },
  { id: "capabilities", label: "产品能力", path: ROUTE_PATHS.capabilities },
  { id: "reliability", label: "可靠性验证", path: ROUTE_PATHS.reliability },
  { id: "scenarios", label: "应用场景", path: ROUTE_PATHS.scenarios },
  { id: "demo", label: "在线体验", path: ROUTE_PATHS.demo },
];

export const pathToRouteKey = (pathname: string): RouteKey => {
  const normalized = pathname.toLowerCase();
  const found = ROUTE_NAV_ITEMS.find((item) => item.path.toLowerCase() === normalized);
  return found?.id ?? "home";
};
