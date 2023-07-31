import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { TextField, Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./styles.scss";
import { ErrorMessage } from "formik";
import { DesktopTimePicker, MobileTimePicker } from "@mui/lab";

export default function TimePicker(props: {
  field: any;
  form: any;
  label: any;
  disabled: any;
  defaultValue?: any;
}) {
  const { field, form, label, defaultValue } = props;
  const { name } = field;
  const { errors, touched, setFieldValue } = form;
  const showError = errors[name] && touched[name];

  const [value, setValue] = React.useState<Dayjs | null>(
    defaultValue && defaultValue[name]
      ? dayjs(`2022-18-09 ${defaultValue[name]}`)
      : dayjs()
  );

  const handleChange = (newValue: Dayjs | null) => {
    setValue(dayjs(newValue, "HH:mm:ss"));
    setFieldValue(name, dayjs(newValue).format("HH:mm:ss"));
  };

  React.useEffect(() => {
    if (defaultValue && defaultValue[name])
      setFieldValue(name, defaultValue[name]);
    else setFieldValue(name, dayjs().format("HH:mm:ss"));
  }, []);

  return (
    <Stack>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <MobileTimePicker
            label={label}
            value={value}
            onChange={handleChange}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <DesktopTimePicker
            label={label}
            value={value}
            onChange={handleChange}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </Box>
      </LocalizationProvider>
      <ErrorMessage name={name} component="p" className="error" />
    </Stack>
  );
}
