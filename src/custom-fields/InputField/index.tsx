import { ElementType, useEffect } from "react";
import { ErrorMessage } from "formik";
import { Stack } from "@mui/system";
import { TextField, IconButton, InputAdornment } from "@mui/material";

import "./styles.scss";
import { getEndDate } from "../../utils/DateHelper";

interface IProps {
  field: any;
  form: any;
  label: string;
  disabled: any;
  Icon?: ElementType;
  helperText?: string;
  multiline: boolean;
  rows: number;
  type: string;
  inputProps?: any;
  defaultValue?: any;
}

function InputField(props: IProps) {
  const {
    field,
    form,
    label,
    disabled,
    Icon,
    helperText,
    multiline,
    rows,
    type,
    inputProps,
    defaultValue,
  } = props;
  const { name } = field;
  const { errors, touched, setFieldValue, values } = form;
  const showError = errors[name] && touched[name];
  const start_date = values?.fee?.start_date;
  const classes = values?.classes;
  const student_id = values.student_id;
  const used_rest = values?.used_rest

  const handleChange = async (event: any) => {
    const new_value = event.target.value as string;
    setFieldValue(name, new_value);

    if (name !== "fee.unit_num") return;

    const unit_num = parseInt(new_value);
    const unit_used = parseInt(used_rest.split("/")[0]);

    if (unit_num < 1) {
      return setFieldValue("fee.end_date", null);
    }

    if (student_id) {
      const unit_rest = unit_num - unit_used;
      setFieldValue("used_rest", `${unit_used} / ${unit_rest}`);
    }

    const endDate = getEndDate(unit_num, start_date, classes);
    setFieldValue("fee.end_date", endDate);
  };

  useEffect(() => {
    defaultValue &&
      defaultValue[name] &&
      setFieldValue(name, defaultValue[name]);
  }, [defaultValue, name, setFieldValue]);

  return (
    <Stack alignItems="flex-start">
      <TextField
        {...field}
        id={name}
        label={label}
        type={type}
        disabled={disabled}
        error={showError}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color={showError && "error"}
                aria-label={label}
                sx={{ mr: -1.5 }}
                disabled
              >
                {Icon && <Icon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        helperText={!showError && helperText}
        multiline={multiline}
        rows={rows}
        inputProps={inputProps}
        onChange={handleChange}
      />
      <ErrorMessage name={name} component="p" className="error" />
    </Stack>
  );
}

export default InputField;
