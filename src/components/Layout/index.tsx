import React, { ReactNode, useState } from "react";

import { Box, Toolbar } from "@mui/material";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box>
      <div className="main">
        {children}
      </div>
    </Box>
  );
};

export default Layout;
