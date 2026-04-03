import { Home, BarChart3, Settings, Receipt } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", icon: Home },
  { to: "/transactions", icon: Receipt },
  { to: "/insights", icon: BarChart3 },
  { to: "/settings", icon: Settings },
];

export default function MobileNav() {
  return (
    <>
      {items.map(({ to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="flex flex-col items-center text-muted-foreground py-3"
        >
          <Icon size={20} />
        </NavLink>
      ))}
    </>
  );
}