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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
