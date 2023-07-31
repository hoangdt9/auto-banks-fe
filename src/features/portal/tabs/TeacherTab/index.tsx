import { useEffect } from "react";
import TeacherList from "../../components/TeacherList";

interface IProps {
  active: any;
  setActive: React.Dispatch<React.SetStateAction<any>>;
}

const TeacherTab = (props: IProps): JSX.Element => {
  const { active, setActive } = props;
  useEffect(() => {
    setActive({ teacher: "active" });
  }, [setActive]);

  return <TeacherList active={active} />;
};

export default TeacherTab;
