import {
  SidebarProvider,
  SidebarInset,
} from "../ui/sidebar";

import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Header />

        <main className="p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
