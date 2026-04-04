import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Home, BarChart3, Settings, Receipt } from "lucide-react";
import { NavLink } from "react-router-dom";
const items = [
    { to: "/", icon: Home },
    { to: "/transactions", icon: Receipt },
    { to: "/insights", icon: BarChart3 },
    { to: "/settings", icon: Settings },
];
export default function MobileNav() {
    return (_jsx(_Fragment, { children: items.map(({ to, icon: Icon }) => (_jsx(NavLink, { to: to, className: "flex flex-col items-center text-muted-foreground py-3", children: _jsx(Icon, { size: 20 }) }, to))) }));
}
