import { ErrorMessage } from "formik";
import { Stack } from "@mui/system";
import { Autocomplete, TextField, Box } from "@mui/material";
import styled from "@emotion/styled";

export interface OptionType {
  label: string;
  id: string;
}

interface IProps {
  field: any;
  form: any;
  label: any;
  disabled: any;
  options: OptionType;
  size?: "small" | "medium" | undefined;
  width?: number;
  type?: string;
  setLocation?: React.Dispatch<React.SetStateAction<string>>;
  setClassId?: React.Dispatch<React.SetStateAction<number>>;
}

const StyledOptionBox = styled(Box)({
  fontSize: 12,
  fontWeight: 400,
});

function AutocompleteField(props: IProps) {
  const {
    field,
    form,
    label,
    options,
    size,
    width,
    type,
    setLocation,
    setClassId,
  } = props;
  const { name } = field;
  const { errors, touched, setFieldValue } = form;
  const showError = errors[name] && touched[name];

  const handleChange = (e: any, values: any) => {
    setFieldValue(name, values);

    if (type !== "diemdanh") return;

    if (name === "class") {
      const location = {
        label: values?.location_name ?? "",
        id: values?.location ?? "location none",
      };

      setFieldValue("location", location);
      setClassId && setClassId(values?.id ?? 0);
    }

    if (name === "location") {
      setLocation && setLocation(values?.id ?? "");
      setFieldValue("class", null);
      setClassId && setClassId(0);
    }
  };

  return (
    <Stack>
      <Autocomplete
        {...field}
        isOptionEqualToValue={(option: OptionType, value: OptionType) =>
          option?.id === value?.id
        }
        getOptionLabel={(option: OptionType) => option?.label}
        options={options ?? []}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!!showError}
            InputProps={
              type === "diemdanh"
                ? {
                  ...params.InputProps,
                  style: {
                    fontSize: 12,
                    fontWeight: 400,
                  },
                }
                : params.InputProps
            }
            InputLabelProps={
              type === "diemdanh"
                ? {
                  style: {
                    fontSize: 12,
                  },
                }
                : params.InputLabelProps
            }
          />
        )}
        renderOption={(props, option: OptionType) => {
          return type === "diemdanh" ? (
            <li {...props}>
              <StyledOptionBox>{option.label}</StyledOptionBox>
            </li>
          ) : (
            <li {...props}>{option.label}</li>
          );
        }}
        onChange={handleChange}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        size={size}
        sx={width ? { width: { width } } : null}
        fullWidth
      />
      <ErrorMessage name={name} component="p" className="error" />
    </Stack>
  );
}

export default AutocompleteField;
