import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface IProps {
  field?: any;
  form?: any;
  disabled?: any;
  reason?: string;
  setReason?: any;
}

export default function OffReasonField(props: IProps) {
  const { field, form, reason, setReason } = props;
  const { name } = field;
  const { setFieldValue } = form;

  const handleReasonChange = (event: SelectChangeEvent) => {
    setReason(event.target.value as string);
    setFieldValue(name, event.target.value as string);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="select-label">Lý do nghỉ</InputLabel>
      <Select
        size="small"
        labelId="select-label"
        value={reason === "Lớp Học" || reason === "Lớp nghỉ" ? "" : reason}
        label="Lý do nghỉ"
        onChange={handleReasonChange}
        fullWidth
      >
        <MenuItem value="Nghỉ mưa">Nghỉ mưa</MenuItem>
        <MenuItem value="Nghỉ lễ">Nghỉ lễ</MenuItem>
        <MenuItem value="Nghỉ khác">Nghỉ khác</MenuItem>
      </Select>
    </FormControl>
  );
}
