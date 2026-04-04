import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
export default function AppShell() {
    return (_jsxs(SidebarProvider, { children: [_jsx(AppSidebar, {}), _jsxs(SidebarInset, { className: "min-h-svh bg-background text-foreground", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 p-4 pb-20 lg:p-6 lg:pb-6", children: _jsx(Outlet, {}) })] }), _jsx("div", { className: "fixed bottom-0 left-0 right-0 border-t bg-card lg:hidden", children: _jsx("div", { className: "flex justify-around py-2", children: _jsx(MobileNav, {}) }) })] }));
}
