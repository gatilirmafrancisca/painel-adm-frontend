import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  layout("components/Layout.tsx", [
    route("dashboard", "routes/placeholder.tsx")
  ]),
] satisfies RouteConfig;