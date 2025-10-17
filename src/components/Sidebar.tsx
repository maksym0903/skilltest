"use client";

import * as React from "react";
import {
  Drawer, Toolbar, List, ListItemButton, ListItemIcon, ListItemText, Divider, Collapse
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableViewIcon from "@mui/icons-material/TableView";
import SettingsIcon from "@mui/icons-material/Settings";
import AppsIcon from "@mui/icons-material/Apps";
import DomainIcon from "@mui/icons-material/Domain";
import CloudIcon from "@mui/icons-material/Cloud";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";

const DRAWER_OPEN = 240;
const DRAWER_CLOSED = 64;

export default function Sidebar({ open }: { open: boolean }) {
  const [usersOpen, setUsersOpen] = React.useState(false);

  const handleUsersClick = () => {
    setUsersOpen(!usersOpen);
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? DRAWER_OPEN : DRAWER_CLOSED,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_OPEN : DRAWER_CLOSED,
          boxSizing: "border-box",
          top: 64, // Position below the topbar (AppBar height)
          height: "calc(100vh - 64px)", // Full height minus topbar
          zIndex: (theme) => theme.zIndex.drawer,
        },
      }}
    >
      <Toolbar />
      <List sx={{ p: 1 }}>
        <ListItemButton component={Link} href="/dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} href="/apps">
          <ListItemIcon><AppsIcon /></ListItemIcon>
          <ListItemText primary="My Apps" />
        </ListItemButton>
        <ListItemButton component={Link} href="/repos">
          <ListItemIcon><TableViewIcon /></ListItemIcon>
          <ListItemText primary="Repos" />
        </ListItemButton>
        <ListItemButton component={Link} href="/environment">
          <ListItemIcon><PublicIcon /></ListItemIcon>
          <ListItemText primary="Environment" />
        </ListItemButton>
        <ListItemButton component={Link} href="/aws-account">
          <ListItemIcon><CloudIcon /></ListItemIcon>
          <ListItemText primary="AWS Account" />
        </ListItemButton>
        <ListItemButton component={Link} href="/domains">
          <ListItemIcon><DomainIcon /></ListItemIcon>
          <ListItemText primary="Domains" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={handleUsersClick}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Users" />
          {usersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <Collapse in={usersOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={Link} href="/profile" sx={{ pl: 4 }}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton component={Link} href="/users" sx={{ pl: 4 }}>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="List" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider sx={{ my: 1 }} />
        <ListItemButton component={Link} href="/settings">
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
