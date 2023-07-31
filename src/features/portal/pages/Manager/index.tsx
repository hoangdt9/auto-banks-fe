import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { MENU_MANAGER } from "../../../../constants/CommonConstant";
import Topbar from "../../components/Topbar";
import StudentForm from "../../components/StudentForm";
import TeacherForm from "../../components/TeacherForm";
import AttendanceTab from "../../tabs/AttendanceTab";
import CatalogTab from "../../tabs/CatalogTab";
import ClassTab from "../../tabs/ClassTab";
import StatisticTab from "../../tabs/StatisticTab";
import StudentTab from "../../tabs/StudentTab";
import TeacherTab from "../../tabs/TeacherTab";
import StudentCalendar from "../../components/StudentCalendar";

const Manager = () => {
  const [active, setActive] = useState<any>({ student: "active" });
  return (
    <>
      <Topbar tabs={MENU_MANAGER} active={active} setActive={setActive} />
      <Routes>
        <Route
          path="/"
          element={<StudentTab active={active} setActive={setActive} />}
        />
        <Route
          index
          element={<StudentTab active={active} setActive={setActive} />}
        />
        <Route
          path="student"
          element={<StudentTab active={active} setActive={setActive} />}
        />
        <Route
          path="attendance"
          element={<AttendanceTab setActive={setActive} />}
        />
        <Route
          path="teacher"
          element={<TeacherTab active={active} setActive={setActive} />}
        />
        <Route path="class" element={<ClassTab setActive={setActive} />} />
        <Route
          path="catalog"
          element={<CatalogTab setActive={setActive} active={active} />}
        />
        <Route
          path="statistic"
          element={<StatisticTab setActive={setActive} />}
        />
        <Route
          path="add-student"
          element={<StudentForm setActive={setActive} />}
        />
        <Route
          path="portal/add-student"
          element={<StudentForm setActive={setActive} />}
        />
        <Route
          path="student/add-student"
          element={<StudentForm setActive={setActive} />}
        />
        <Route
          path="update-student"
          element={<StudentForm setActive={setActive} />}
        />
        <Route
          path="portal/update-student"
          element={<StudentForm setActive={setActive} />}
        />
        <Route
          path="student/update-student"
          element={<StudentForm setActive={setActive} />}
        />
        <Route
          path="calendar-student"
          element={<StudentCalendar setActive={setActive} />}
        />
        <Route
          path="portal/calendar-student"
          element={<StudentCalendar setActive={setActive} />}
        />
        <Route
          path="student/calendar-student"
          element={<StudentCalendar setActive={setActive} />}
        />
        <Route
          path="teacher/add-teacher"
          element={<TeacherForm setActive={setActive} />}
        />
      </Routes>
    </>
  );
};
export default Manager;
