import { useCallback } from "react";
import { useQuery } from "react-query";

import Manager from "./pages/Manager";
import userApi from "../../api/userApi";
import Home from "./pages/Home";
import { useNavigate } from "react-router-dom";
import Admin from "./pages/Admin";

Portal.propTypes = {};

function Portal(): JSX.Element {
  const { status, data } = useQuery(
    "user",
    userApi.getUser,
    {
      enabled: false,
    }
  );

  const navigate = useNavigate();

  const goSignIn = useCallback(
    () => navigate("/auth/sign-in", { replace: true }),
    [navigate]
  );

  if (status === "loading") return <h1>Loading...</h1>;
  if (status === "error") goSignIn();

  if (isManager(data)) return <Manager />;
  if (isAdmin(data)) return <Admin />;

  return <Home />;
}

const isManager = (user: any) => user?.role === "MANAGER";

const isAdmin = (user: any) => user?.role === "ADMIN";

export default Portal;
