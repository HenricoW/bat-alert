import { Box, createTheme, ThemeProvider } from "@mui/material";
import { grey } from "@mui/material/colors";

import Layout from "./components/Layout";
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
          <LoginPage />
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
