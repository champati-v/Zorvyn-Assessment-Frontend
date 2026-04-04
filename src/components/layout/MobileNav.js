import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { BarChart3, Home, Receipt, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
const items = [
    { to: "/", icon: Home },
    { to: "/transactions", icon: Receipt },
    { to: "/insights", icon: BarChart3 },
    { to: "/settings", icon: Settings },
];
export default function MobileNav() {
    return (_jsx(_Fragment, { children: items.map(({ to, icon: Icon }) => (_jsx(NavLink, { to: to, end: to === "/", className: "flex flex-1 flex-col items-center text-muted-foreground py-3", children: ({ isActive }) => (_jsx(Icon, { size: 20, className: isActive ? "text-emerald-600" : undefined })) }, to))) }));
}
