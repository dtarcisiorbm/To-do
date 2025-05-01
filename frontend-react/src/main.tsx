import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AppRoutes } from "./routes";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<AuthProvider>
			<SidebarProvider>
				<AppRoutes />
			</SidebarProvider>
		</AuthProvider>
	</React.StrictMode>,
);
