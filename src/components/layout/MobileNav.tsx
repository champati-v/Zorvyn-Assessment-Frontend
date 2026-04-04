import { BarChart3, Home, Receipt, Settings } from "lucide-react";
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
          end={to === "/"}
          className="flex flex-1 flex-col items-center text-muted-foreground py-3"
        >
          {({ isActive }) => (
            <Icon
              size={20}
              className={isActive ? "text-emerald-600" : undefined}
            />
          )}
        </NavLink>
      ))}
    </>
  );
}
