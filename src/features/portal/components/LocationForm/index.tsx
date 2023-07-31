import { Grid } from "@mui/material";
import { FastField } from "formik";
import InputField from "../../../../custom-fields/InputField";
import LOCATION_TABLE from "./LOCATION_TABLE";

interface IProps {
  defaultValue?: any;
}

export const LocationForm = (props: IProps) => {
  const { defaultValue } = props;

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 2 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      sx={{ pt: 2 }}
    >
      <Grid item xs={12} sm={8} md={6}>
        <FastField
          name="name"
          component={InputField}
          label="Tên cơ sở"
          defaultValue={defaultValue}
        />
      </Grid>
      {LOCATION_TABLE.map((item, index) => (
        <Grid item xs={12} sm={4} md={3} key={index}>
          <FastField
            name={item?.name}
            component={InputField}
            label={item?.label}
            defaultValue={defaultValue}
          />
        </Grid>
      ))}
    </Grid>
  );
};
