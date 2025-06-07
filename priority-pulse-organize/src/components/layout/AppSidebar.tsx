import React, { useState } from "react";
import { Calendar, List, UserCog, MessageSquare } from "lucide-react";
import { EditUserDialog } from "@/components/user/EditUserDialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AppSidebar = () => {
  const { logout, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleUpdateUser = async (data: { name: string; email: string; phone: string }) => {
    if (!user) return;
    await updateUser({
      ...data,
      username: data.name,
    });
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Priority Pulse</h1>
          <SidebarTrigger />
        </div>
        {user && (
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{user.username}</p>
                <p>{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent"
                onClick={() => setIsEditUserOpen(true)}
                title="Editar perfil"
              >
                <UserCog className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={isActive("/") ? "bg-accent" : ""}
                  onClick={() => navigate("/")}
                >
                  <List className="mr-2 h-4 w-4" />
                  <span>List View</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={isActive("/calendar") ? "bg-accent" : ""}
                  onClick={() => navigate("/calendar")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Calendar View</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Chat</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={isActive("/chat") ? "bg-accent" : ""}
                  onClick={() => navigate("/chat")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Chat Assistant</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent className="px-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span>Personal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span>Work</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span>Study</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span>Health</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="outline" className="w-full" onClick={logout}>
          Sign Out
        </Button>
      </SidebarFooter>

      <EditUserDialog
        open={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        defaultValues={{
          name: user?.username || "",
          email: user?.email || "",
          phone: user?.phone || "",
        }}
        onSubmit={handleUpdateUser}
      />
    </Sidebar>
  );
};

export default AppSidebar;
