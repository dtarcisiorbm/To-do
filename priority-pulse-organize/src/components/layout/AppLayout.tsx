import React, { useEffect, useState } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { llamaService } from "@/services/api";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayoutContent = ({ children }: AppLayoutProps) => {
  const { open, setOpen } = useSidebar();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className={`flex-1 overflow-auto ${open ? "ml-0" : "ml-16"}`}>
        {!open && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        {/* Adicionar indicador de status do serviço aqui */}
        {children}
      </main>
    </div>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
};

export default AppLayout;
