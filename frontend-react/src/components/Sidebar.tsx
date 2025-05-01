import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,

} from "@mui/material";
import {
 
  PersonPinCircleOutlined,

  ExitToApp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";

export const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    {
      icon: <PersonPinCircleOutlined />,
      label: "Profile",
      onClick: () => {
        navigate("/profile");
        closeSidebar();
      },
    },
    {
      icon: <ExitToApp />,
      label: "Logout",
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={closeSidebar}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary">
          {user?.name || 'User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.username}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <List>
        {menuItems.map((item,index) => (
          <ListItem
            key={index}
            button
            onClick={item.onClick}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          variant="outlined"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};
