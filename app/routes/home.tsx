import type { Route } from "./+types/home";
import { DispensesManager } from "../dispenses-manager/dispenses-manager";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "App Dispesas" },
    { name: "description", content: "Organize suas despesas!" },
  ];
}

export default function Home() {
  return <DispensesManager />;
}
