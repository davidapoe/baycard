import { createFileRoute } from "@tanstack/react-router";
import { ShopScreen } from "@/screens/shop-screen";

export const Route = createFileRoute("/shop")({ component: ShopPage });

function ShopPage() {
  return <ShopScreen />;
}
