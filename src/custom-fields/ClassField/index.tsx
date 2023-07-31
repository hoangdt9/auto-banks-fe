import { useState, useEffect } from "react";
import {
  Autocomplete,
  Grid,
  TextField,
  IconButton,
  DialogProps,
  Typography,
} from "@mui/material";
import ClassIcon from "@mui/icons-material/Class";
import dayjs from "dayjs";

import Schedule from "../../features/portal/components/Schedule";
import Popup from "../../components/Popup";
import classApi from "../../api/classApi";
import studentApi from "../../api/studentApi";
import { getEndDate } from "../../utils/DateHelper";
import { IClass } from "../../types";

interface IProps {
  field: any;
  form: any;
  label: string;
  options: IClass[];
  student: any;
}

function ClassField(props: IProps) {
  const { field, form, label, options, student } = props;
  const { name } = field;
  const { setFieldValue, values } = form;
  const { student_id } = values;
  const { unit_num, start_date } = values?.fee;

  const [classes, setClasses] = useState<IClass[]>([]);
  const [showPopup, setshowPopup] = useState(false);
  const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("xs");
  const [popupTitle, setPopupTitle] = useState<any>();

  const handleChange = async (e: any, new_values: IClass[]) => {
    setFieldValue(name, new_values);
    setClasses(new_values);
  };

  const showSchedule = () => {
    setMaxWidth("xl");
    setshowPopup(true);
    setPopupTitle(() => {
      return (
        <Typography sx={{ minWidth: 90 }} variant="h6" component="div">
          Danh sách lớp học
        </Typography>
      );
    });
  };

  useEffect(() => {
    const fetchClass = async () => {
      const data = await classApi.getClassesByStudent(student?.id);

      setClasses(data);
      setFieldValue("classes", data);
    };

    student && fetchClass();
  }, [name, setFieldValue, student]);

  useEffect(() => {
    const fetchAttendanceUnit = async () => {
      let num = parseInt(unit_num);
      if (student_id) {
        const data = await studentApi.getAttendanceUnit(
          student_id,
          dayjs(start_date).format("YYYY-MM-DD")
        );
        const { valid_absent } = data;
        num += valid_absent;
      }

      const endDate = getEndDate(num, start_date, classes);
      setFieldValue("fee.end_date", endDate);
    };

    student_id && classes && fetchAttendanceUnit();
  }, [classes, setFieldValue, start_date, student_id, unit_num]);

  return (
    <>
      <Grid item xs={3.8} md={6}>
        <Autocomplete
          multiple
          limitTags={2}
          options={options}
          getOptionLabel={(option: IClass) => option.class_id}
          isOptionEqualToValue={(option: IClass, value: IClass) =>
            option?.id === value?.id
          }
          renderInput={(params) => (
            <TextField {...params} label={label} placeholder={label} />
          )}
          onChange={handleChange}
          value={classes}
        />
      </Grid>
      <Grid item xs={0.2} md={0.5} sx={{ mt: 1, ml: -2.5 }}>
        <IconButton aria-label="pick" onClick={showSchedule}>
          <ClassIcon color="action" />
        </IconButton>
      </Grid>

      <Popup
        maxWidth={maxWidth}
        open={showPopup}
        setOpen={setshowPopup}
        popupTitle={popupTitle}
        popupContent={
          <Schedule
            classes={classes}
            setClasses={setClasses}
            setFieldValue={setFieldValue}
          />
        }
        haveOk={true}
      />
    </>
  );
}

export default ClassField;
