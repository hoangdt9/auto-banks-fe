import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { MENU_ADMIN } from "../../../../constants/CommonConstant";
import Topbar from "../../components/Topbar";
import Dashboard from "../../tabs/Dashboard";
import Bank from "../../tabs/Bank/Bank";

const Admin = () => {
  const [active, setActive] = useState<any>({ dashboard: "active" });
  return (
    <>
      <Topbar tabs={MENU_ADMIN} active={active} setActive={setActive} />
      <Routes>
        <Route
          path="/"
          element={<Dashboard active={active} setActive={setActive} />}
        />
        <Route
          index
          element={<Dashboard active={active} setActive={setActive} />}
        />
        <Route
          path="dashboard"
          element={<Dashboard active={active} setActive={setActive} />}
        />
        <Route
          path="bank"
          element={<Bank active={active} setActive={setActive} />}
        />
      </Routes>
    </>
  );
};
export default Admin;
