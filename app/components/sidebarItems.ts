import { LayoutDashboard, Wallet, Cat, Users, Gift } from "lucide-react";

export const sidebarGroups = [
  {
    title: "Painel",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/financeiro", label: "Financeiro", icon: Wallet },
      { path: "/gatos", label: "Gatos", icon: Cat },
      { path: "/voluntarios", label: "Voluntários", icon: Users },
      { path: "/rifasolidaria", label: "Rifa", icon: Gift }
    ],
  },
];