import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import AdbIcon from "@mui/icons-material/Adb";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useUser } from "../../context/user-context";
import { ChangePasswordDialog } from "../change-password/change-password";
import { useApi } from "../../hooks/useApi";
import { useSnackbar } from "../../context/snackbar-context";
import { useSubscription } from "@apollo/client";
import { BOOK_ADDED } from "../../graphql/subscriptions/book-subscriptions";

const AppHeader: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const { user, logoutUser } = useUser();
  const { showMessage } = useSnackbar();
  const { saveData } = useApi();
  const { data, loading } = useSubscription(BOOK_ADDED);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setNotifications((prev) => [...prev, data.bookAdded]);
    }
    console.log("Header", data, loading);
  }, [data, loading]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    handleCloseNotifications();
  };

  const handleLogout = () => {
    logoutUser();
    handleCloseUserMenu();
  };

  const handleChangePasswordClick = () => {
    setOpenChangePasswordDialog(true);
    handleCloseUserMenu();
  };

  const handleCloseChangePasswordDialog = () => {
    setOpenChangePasswordDialog(false);
  };

  const handleSubmitChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      const data = await saveData({
        method: "PATCH",
        url: "/users/change-password",
        payload: { currentPassword, newPassword, confirmPassword },
      });

      showMessage(data.message);
      handleCloseChangePasswordDialog();
    } catch (error: any) {
      showMessage(error.message || "Failed to change password");
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: "flex", mr: 1 }} />
          <Link to="/" style={{ textDecoration: "none", flexGrow: 1 }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "white",
              }}
            >
              Library Management System
            </Typography>
          </Link>
          {user && user.role !== 'admin' && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open notifications">
                <IconButton onClick={handleOpenNotifications} sx={{ pr: 2 }}>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-notifications"
                anchorEl={anchorElNotifications}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotifications}
              >
                <MenuItem>
                  <Typography textAlign="center" onClick={handleClearNotifications}>
                    <ClearAllIcon /> Clear All
                  </Typography>
                </MenuItem>
                <Divider />
                {notifications.length > 0 ? (
                  <List>
                    {notifications.map((notification, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`New book added: ${notification.name}`} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <MenuItem>
                    <Typography textAlign="center">No new notifications</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {user.username && <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleChangePasswordClick}>
                    <Typography textAlign="center">Change Password</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={onLoginClick}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      <ChangePasswordDialog
        open={openChangePasswordDialog}
        handleClose={handleCloseChangePasswordDialog}
        // handleSubmit={handleSubmitChangePassword}
      />
    </AppBar>
  );
};

export default AppHeader;
