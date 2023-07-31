import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";
import { LocalizationProvider, MobileDatePicker, PickersLocaleText, StaticDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface IProps {
  field: any;
  form: any;
  disabled?: any;
  setDow?: any;
  type?: string;
  setDate?: any;
  setClassId?: any;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const vi: Partial<PickersLocaleText<any>> = {
  okButtonLabel: "Đồng ý",
  cancelButtonLabel: "Hủy",
  datePickerToolbarTitle: 'Ngày đã chọn',
};

export default function DatePickerField(props: IProps) {
  const { field, form, setDow, type, setDate, setClassId } = props;
  const { name } = field;
  const { setFieldValue, values, errors } = form;

  const [value, setValue] = useState<Dayjs | null>(dayjs(values[name]));

  const handleChange = (newValue: any) => {
    setValue(newValue);

    if (type !== "diemdanh") return;

    setDate(newValue);
    setClassId(0);

    const dow = new Date(newValue).getDay();
    setDow(dow);

    setFieldValue(name, dayjs(newValue).format("YYYY-MM-DD"));
    setFieldValue("location", null);
    setFieldValue("teacher", null);
    setFieldValue("class", null);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="vi"
      localeText={vi}
    >
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        <MobileDatePicker
          label="Ngày điểm danh"
          value={value}
          onChange={handleChange}
          slotProps={{
            textField: {
              helperText: errors[name],
            },
          }}
        />
      </Box>

      <Item sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        <StaticDatePicker
          orientation="portrait"
          openTo="day"
          value={value}
          onChange={handleChange}
        />
      </Item>
    </LocalizationProvider>
  );
}
