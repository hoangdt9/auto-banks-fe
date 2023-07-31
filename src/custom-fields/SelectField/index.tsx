import PropTypes from "prop-types";
import { ErrorMessage } from "formik";
import { Stack } from "@mui/system";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";

import "./styles.scss";

SelectField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

SelectField.defaultProps = {
  field: null,
  form: null,
  type: "text",
  label: "",
  placeholder: "",
  disabled: false,
};

interface IProps {
  field?: any;
  form?: any;
  label?: string;
  options?: any;
  defaultValue?: any;
}

function SelectField(props: IProps) {
  const { field, form, label, defaultValue, options } = props;
  const { name } = field;
  const { errors, touched, setFieldValue } = form;
  const showError = errors[name] && touched[name];

  const initialValue =
    defaultValue && defaultValue[name]
      ? defaultValue[name]
      : name === "day_of_week"
        ? 0
        : "";

  const [newValue, setValue] = useState(initialValue);
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
    setFieldValue(name, event.target.value);
  };

  useEffect(() => {
    if (defaultValue && defaultValue[name]) setFieldValue(name, initialValue);
    else if (name === "day_of_week") setFieldValue(name, 0);
  }, []);

  return (
    <Stack>
      <Box>
        <FormControl fullWidth>
          <InputLabel id="select-label">{label}</InputLabel>
          <Select
            fullWidth
            labelId="select-label"
            value={newValue}
            label={label}
            onChange={handleChange}
          >
            {options?.map((option: any, index: number) => (
              <MenuItem key={index} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <ErrorMessage name={name} component="p" className="error" />
    </Stack>
  );
}

export default SelectField;
