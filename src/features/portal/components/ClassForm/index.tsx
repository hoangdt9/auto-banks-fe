import { Grid } from "@mui/material";
import { FastField } from "formik";
import { DAY_OF_WEEK } from "../../../../constants/CommonConstant";
import InputField from "../../../../custom-fields/InputField";
import ManyTeacherSelectField from "../../../../custom-fields/ManyTeacherSelectField";
import SelectField from "../../../../custom-fields/SelectField";
import TimePickerField from "../../../../custom-fields/TimePickerField";
import {
  CLASS_TABLE_ROW_1,
  CLASS_TABLE_ROW_2,
  CLASS_TABLE_ROW_3,
} from "./CLASS_TABLE";

interface IProps {
  defaultValue?: any;
}

const TYPE = [
  { label: "A", id: "A" },
  { label: "B", id: "B" },
  { label: "C", id: "C" },
];

const STATUS = [
  { label: "Lớp đóng", id: false },
  { label: "Lớp mở", id: true },
];

export const ClassForm = (props: IProps) => {
  const { defaultValue } = props;

  const renderComponent = (type: string) => {
    switch (type) {
      case "InputField":
        return InputField;
      case "TimePickerField":
        return TimePickerField;
      case "SelectField":
        return SelectField;
      case "ManyTeacherSelectField":
        return ManyTeacherSelectField;

      default:
        return type;
    }
  };

  const renderOptions = (type: string | undefined) => {
    switch (type) {
      case "dowList":
        return Array.from(DAY_OF_WEEK)?.map(([key, value]) => {
          return { label: value, id: key };
        });
      case "typeList":
        return TYPE;
      case "statusList":
        return STATUS;
      default:
        break;
    }
  };

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 2 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      sx={{ pt: 2 }}
    >
      {CLASS_TABLE_ROW_1.map((item, index) => (
        <Grid item xs={12} sm={4} md={3} key={index}>
          <FastField
            name={item?.name}
            component={renderComponent(item?.fieldType)}
            options={renderOptions(item?.option)}
            label={item?.label}
            defaultValue={defaultValue}
          />
        </Grid>
      ))}

      {CLASS_TABLE_ROW_2.map((item, index) => (
        <Grid item key={index} md={3} xs={6}>
          <FastField
            name={item?.name}
            component={renderComponent(item?.fieldType)}
            label={item?.label}
            options={renderOptions(item?.option)}
            defaultValue={defaultValue}
          />
        </Grid>
      ))}

      <Grid item md={6} xs={12}>
        <FastField
          name={CLASS_TABLE_ROW_3?.name}
          component={renderComponent(CLASS_TABLE_ROW_3?.fieldType)}
          label={CLASS_TABLE_ROW_3?.label}
          defaultValue={defaultValue}
          type="class"
        />
      </Grid>
    </Grid>
  );
};
