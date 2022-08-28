import React from "react";

import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";

import { appName, drawerWidth, navList } from "../../config";

interface MobileMenuProps {
  menuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MobileMenu = ({ menuOpen, toggleMobileMenu }: MobileMenuProps) => {
  return (
    <Box component="nav">
      <Drawer
        variant="temporary"
        open={menuOpen}
        onClose={toggleMobileMenu}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <Box onClick={toggleMobileMenu} sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            {appName}
          </Typography>
          <Divider />
          <List>
            {navList.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton sx={{ textAlign: "center" }}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MobileMenu;
