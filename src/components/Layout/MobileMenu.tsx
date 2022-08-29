import React from "react";

import { Box, Button, Divider, Drawer, Stack, Typography } from "@mui/material";

import { appName, drawerWidth } from "../../config";
import { logUserOut } from "../../core/user.service";
import { useAppSelector } from "../../hooks/storeHooks";

interface MobileMenuProps {
  menuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MobileMenu = ({ menuOpen, toggleMobileMenu }: MobileMenuProps) => {
  const userToken = useAppSelector((state) => state.user.token_id);

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

          <Stack p="2em 1em">
            {userToken && (
              <>
                <Button variant="contained" color="warning" onClick={logUserOut}>
                  Logout
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MobileMenu;
