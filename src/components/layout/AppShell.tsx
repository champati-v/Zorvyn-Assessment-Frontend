import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppShell() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-h-svh bg-background text-foreground">
        <Header />

        <main className="flex-1 p-4 pb-20 lg:p-6 lg:pb-6">
          <Outlet />
        </main>
      </SidebarInset>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-card lg:hidden">
        <div className="flex justify-around py-2">
          <MobileNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
