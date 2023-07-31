import { Outlet, Route, Routes } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";

const Authentication = () => {
  return (
    <>
      <Outlet />
      <Routes>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="email-reset" element={<ForgotPassword />} />
        <Route path="password-reset" element={<ResetPassword />} />
        <Route path="sign-up" element={<SignUp />} />
      </Routes>
    </>
  );
};

export default Authentication;
