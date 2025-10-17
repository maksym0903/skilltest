"use client";

import * as React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Inbox as InboxIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Apps as AppsIcon,
  Help as HelpIcon,
  Favorite as FavoriteIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Diamond as DiamondIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeModeContext } from "@/app/providers";
import SignInButton from "./Buttons/SignInButton";

interface StandardHeaderProps {
  onToggleSidebar?: () => void;
}

export default function StandardHeader({ onToggleSidebar }: StandardHeaderProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const { mode, toggle } = React.useContext(ThemeModeContext);
  const [mounted, setMounted] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleProfileMenuClose();
  };

  const publicNavItems = [
    { label: "Features", href: "/#features" },
    { label: "About", href: "/#about" },
    { label: "Blog", href: "/#blog" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: "blur(8px)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "background.paper",
          opacity: 0.8,
          zIndex: -1,
        },
      }}
    >
      <Toolbar sx={{ px: 2, minHeight: 64 }}>
        {/* Left Section - Branding and Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* Logo/Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                A
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                display: { xs: "none", sm: "block" },
              }}
            >
              App Platform
            </Typography>
          </Box>

          {/* Navigation Items - Only for public pages */}
          {!isAuthenticated && (
            <Stack 
              direction="row" 
              spacing={0.5} 
              sx={{ 
                display: { xs: "none", lg: "flex" },
                ml: 2
              }}
            >
              {publicNavItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  variant="text"
                  size="small"
                  sx={{ 
                    textTransform: "none",
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}
        </Box>

        {/* Spacer to push right section to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Center Section - Search */}
        <Box sx={{ maxWidth: 400, mx: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search apps, environments, users..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: mode === "dark" ? "transparent" : "grey.50",
                border: mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "grey.100",
                  boxShadow: 1,
                  borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "grey.300",
                },
                "&.Mui-focused": {
                  bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "background.paper",
                  boxShadow: 2,
                  borderColor: "primary.main",
                },
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "grey.300",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
        </Box>

        {/* Right Section - User Actions */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          {/* Notifications */}
          <IconButton 
            color="inherit" 
            sx={{ 
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>

          {/* Inbox */}
          <IconButton 
            color="inherit" 
            sx={{ 
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <InboxIcon />
          </IconButton>

          {/* User Profile */}
          <IconButton 
            color="inherit" 
            sx={{ 
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <PersonIcon />
          </IconButton>

          {/* Team */}
          <IconButton 
            color="inherit" 
            sx={{ 
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <GroupIcon />
          </IconButton>

          {/* Apps */}
          <IconButton 
            color="inherit" 
            sx={{ 
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <AppsIcon />
          </IconButton>

          {/* Help */}
          <IconButton 
            color="inherit" 
            sx={{ 
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <HelpIcon />
          </IconButton>

          {/* Favorites */}
          <IconButton 
            color="inherit" 
            sx={{ 
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <FavoriteIcon />
          </IconButton>

          {/* Theme Toggle */}
          <IconButton
            color="inherit"
            onClick={toggle}
            sx={{ 
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            {mounted ? (mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />) : <DarkModeIcon />}
          </IconButton>

          {/* Menu Toggle for Mobile */}
          <IconButton
            color="inherit"
            onClick={onToggleSidebar}
            sx={{ display: { xs: "block", md: "none" }, color: "text.secondary" }}
          >
            <MenuIcon />
          </IconButton>

          {/* User Avatar/Menu */}
          {isAuthenticated && user ? (
            <>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ p: 0, ml: 1 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    minWidth: 200,
                    mt: 1,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.username || "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email || "user@example.com"}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfileMenuClose}>
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <SignInButton />
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
