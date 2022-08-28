import { Box, createTheme, ThemeProvider } from "@mui/material";
import { grey } from "@mui/material/colors";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#fff",
      secondary: grey[500],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Layout>
        <Box m="1em">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>Nothing to see here. Move along.</p>
                  </main>
                }
              />
            </Routes>
          </BrowserRouter>
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
