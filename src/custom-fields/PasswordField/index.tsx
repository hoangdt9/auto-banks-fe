import PropTypes from "prop-types";
import React from "react";
import { ErrorMessage } from "formik";
import { Stack } from "@mui/system";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff, Key } from "@mui/icons-material";
import "./styles.scss";

PasswordField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

PasswordField.defaultProps = {
  field: null,
  form: null,
  type: "text",
  label: "",
  placeholder: "",
  disabled: false,
};

interface State {
  password: string;
  passwordConfirm: string;
  showPassword: boolean;
}

interface Props {
  field: any;
  form: { errors: []; touched: [] };
  label: string;
  disabled: boolean;
  Icon: any;
}

function PasswordField(props: Props) {
  const { field, form, label, disabled, Icon } = props;
  const { name, value } = field;
  const { errors, touched } = form;
  const showError = errors[name] && touched[name];

  const [values, setValues] = React.useState<State>({
    password: "",
    passwordConfirm: "",
    showPassword: false,
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Stack alignItems="flex-start">
      <TextField
        id={name}
        label={label}
        disabled={disabled}
        type={values.showPassword ? "text" : "password"}
        value={values.password}
        onChange={handleChange("password")}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {value ? (
                <IconButton
                  color={showError ? "error" : "primary"}
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  sx={{ mr: -1.5 }}
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ) : (
                <IconButton
                  color={showError && "error"}
                  aria-label="toggle password visibility"
                  sx={{ mr: -1.5 }}
                  disabled
                >
                  {Icon && <Icon />}
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        error={showError}
        {...field}
      />
      <ErrorMessage name={name} component="p" className="error" />
    </Stack>
  );
}

export default PasswordField;
