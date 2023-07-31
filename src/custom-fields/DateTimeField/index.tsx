import { ErrorMessage } from "formik";
import { Stack, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import studentApi from "../../api/studentApi";
import { getEndDate } from "../../utils/DateHelper";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import "./styles.scss";

interface IProps {
  field: any;
  form: any;
  label: any;
  disabled?: any;
  student_id?: any;
  setCallBackDate?: any;
  type?: string;
  size?: any;
}

export default function DateTimeField(props: IProps) {
  const {
    field,
    form,
    label,
    disabled,
    student_id,
    setCallBackDate,
    size,
    type,
  } = props;
  const { name } = field;
  const { errors, touched, setFieldValue, values } = form;
  const showError = errors[name] && touched[name];
  const classes = values?.classes;
  const unit_num = values?.fee?.unit_num;

  const [value, setValue] = useState<Dayjs | null>(dayjs(values[name]));

  const handleChange = async (date: Dayjs | null) => {
    const new_date = dayjs(date).format("YYYY-MM-DD");
    setFieldValue(name, new_date);
    setValue(dayjs(new_date))

    if (name !== "fee.start_date") return;

    let num = parseInt(unit_num) as number;

    if (student_id) {
      const data = await studentApi.getAttendanceUnit(student_id, new_date);
      const { unit_used, valid_absent } = data;
      const unit_rest = parseInt(unit_num) - unit_used;

      num += valid_absent;
      setFieldValue("used_rest", `${unit_used} / ${unit_rest}`);
    }

    const endDate = getEndDate(num, date, classes);
    setFieldValue("fee.end_date", endDate);

    if (type === "statistic") {
      setCallBackDate(new_date);
    }
  };

  return (
    <Stack>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={value}
          disabled={disabled}
          format="DD-MM-YYYY"
          onChange={handleChange}
          slotProps={{
            textField: {
              helperText: errors[name],
              size: size ?? "medium",
            },
          }}
        />
      </LocalizationProvider>
      <ErrorMessage name={name} component="p" className="error" />
    </Stack>
  );
}
