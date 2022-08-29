import React, { useState } from "react";

import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { appName } from "../../config";
import { logUserOut } from "../../core/user.service";
import { useAppSelector } from "../../hooks/storeHooks";

interface NavbarProps {
  toggleMobileMenu: () => void;
}

const Navbar = ({ toggleMobileMenu }: NavbarProps) => {
  const userToken = useAppSelector((state) => state.user.token_id);

  return (
    <AppBar component="nav">
      <Container maxWidth="lg">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleMobileMenu}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            {appName}
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {userToken && (
              <>
                <Button variant="contained" color="warning" onClick={logUserOut}>
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
