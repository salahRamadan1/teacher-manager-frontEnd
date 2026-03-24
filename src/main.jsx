import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider, useSelector } from "react-redux";
import { store } from "./app/store";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import "./i18n";


function AppWithTheme() {
  const mode = useSelector((state) => state.theme.mode);

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppWithTheme />
  </Provider>
);
