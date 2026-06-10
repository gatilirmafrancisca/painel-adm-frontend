import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  layout("components/Layout.tsx", [
    route("dashboard", "routes/placeholder.tsx", {id: "dashboard"}),
    route("gatos", "routes/gatos.tsx", {id: "gatos"}),
    route("voluntarios", "routes/placeholder.tsx", {id: "voluntarios"}),
    route("financeiro", "routes/placeholder.tsx", {id: "financeiro"}),
    route("configuracoes", "routes/placeholder.tsx", {id: "configuracoes"}),
  ]),
] satisfies RouteConfig;