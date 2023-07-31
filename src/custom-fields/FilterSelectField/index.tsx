import { ErrorMessage } from "formik";
import { Stack } from "@mui/system";
import { Autocomplete, TextField, Box } from "@mui/material";
import styled from "@emotion/styled";
import { DAY_OF_WEEK } from "../../constants/CommonConstant";

interface OptionType {
  title: string;
  id: string;
}

function FilterSelectField(props: {
  field: any;
  form: any;
  disabled: any;
  item: any;
  setTypeOption: any;
  setLocationOption: any;
  setDowOption: any;
}) {
  const { field, form, item, setTypeOption, setLocationOption, setDowOption } =
    props;
  const { name } = field;
  const { errors, touched, setFieldValue } = form;
  const showError = errors[name] && touched[name];

  const StyledOptionBox = styled(Box)({
    fontSize: 10,
    fontWeight: 400,
  });

  const handleChange = (e: any, values: any) => {
    e.preventDefault();
    setFieldValue(name, values);

    if (name === "class_type") {
      setTypeOption(values?.id ?? "");
      setFieldValue("class", null);
    }

    if (name === "location") {
      setLocationOption(values?.id ?? "");
      setFieldValue("class", null);
      setFieldValue("class_type", null);
      setFieldValue("dow", null);
    }

    if (name === "dow") {
      setDowOption(values?.id ?? "");
      setFieldValue("class", null);
      setFieldValue("class_type", null);
    }

    if (name === "class") {
      const dow = {
        title: DAY_OF_WEEK.get(values?.dow) ?? "",
        id: values?.dow ?? "",
      };

      const class_type = {
        title: values?.class_type ?? "",
        id: values?.class_type ?? "",
      };

      const location = {
        title: values?.location_name ?? "",
        id: values?.location ?? "",
      };

      setFieldValue("dow", dow);
      setFieldValue("class_type", class_type);
      setFieldValue("location", location);
    }
  };

  return (
    <Stack>
      <Autocomplete
        {...field}
        id={item.id}
        isOptionEqualToValue={(option: OptionType, value: any) => option?.title}
        options={item.options}
        getOptionLabel={(option: OptionType) => option?.title}
        sx={{ width: 200, ml: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={item.label}
            variant="standard"
            error={showError}
            InputProps={{
              ...params.InputProps,
              style: {
                fontSize: 12,
                fontWeight: 400,
              },
            }}
          />
        )}
        renderOption={(props, option: any) => (
          <li {...props}>
            <StyledOptionBox>{option.title}</StyledOptionBox>
          </li>
        )}
        onChange={handleChange}
      />
      <ErrorMessage name={name} component="p" className="error" />
    </Stack>
  );
}

export default FilterSelectField;
