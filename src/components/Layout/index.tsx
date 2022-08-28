import React, { ReactNode, useState } from "react";

import { Box, Toolbar } from "@mui/material";

import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMenuOpen((open) => !open);

  return (
    <Box>
      <Navbar toggleMobileMenu={toggleMobileMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMobileMenu={toggleMobileMenu} />
      <div className="main">
        <Toolbar></Toolbar>
        {children}
      </div>
    </Box>
  );
};

export default Layout;
