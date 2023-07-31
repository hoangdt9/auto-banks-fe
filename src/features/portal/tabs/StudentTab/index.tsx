import { useEffect } from "react";
import StudentList from "../../components/StudentList";

interface IProps {
  active: any;
  setActive: React.Dispatch<React.SetStateAction<any>>;
}

const StudentTab = (props: IProps): JSX.Element => {
  const { active, setActive } = props;
  useEffect(() => {
    setActive({ student: "active" });
  }, [setActive]);

  return <StudentList active={active} />;
};

export default StudentTab;
