import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { SignIn } from "./features/auth/pages/SignIn";
import Authentication from "./features/auth";
import Portal from "./features/portal";
import { getAuth } from "./utils/TokenHelper";
import { ColorModeContext, useMode } from './theme'
import UserProfile from "./features/portal/pages/UserProfile";

const queryClient = new QueryClient();

const Router = (): JSX.Element => {
  const currentUser: any = getAuth();

  if (!currentUser) return <SignIn />;

  return <Portal />;
};

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <StyledEngineProvider injectFirst>
            <BrowserRouter basename="/">
              <Routes>
                <Route path="*" element={<Router />} />
                <Route path="/portal/*" element={<Portal />} />
                <Route path="/auth/*" element={<Authentication />} />
                <Route path="/user-profile" element={<UserProfile />} />
              </Routes>
            </BrowserRouter>
          </StyledEngineProvider>
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
