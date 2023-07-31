import { useEffect, useState } from "react";
import { ErrorMessage } from "formik";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { OptionType } from "../AutocompleteField";
import { useQuery } from "react-query";
import teacherApi from "../../api/teacherApi";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface IProps {
  field?: any;
  form?: any;
  label?: string;
  disabled?: any;
  size?: "small" | "medium" | undefined;
  defaultValue?: any;
  type?: string;
}

export default function ManyTeacherSelectField(props: IProps) {
  const { field, form, label, size, defaultValue, type } = props;
  const { name } = field;
  const { errors, touched, setFieldValue, values } = form;
  const showError = errors[name] && touched[name];
  const [newValue, setNewValue] = useState<OptionType[]>([]);

  const initialValue =
    defaultValue && defaultValue[name] && type === "class"
      ? defaultValue.id
      : values["class"]?.id;

  const { data: teachers } = useQuery("teachers", teacherApi.getAllTeachers);

  const { data: teacher, refetch: refetchTeacher } = useQuery(
    ["teacher", initialValue],
    () => teacherApi.getTeacherByClass(initialValue),
    { enabled: false }
  );

  const TEACHERS = teachers?.results.map((item: any) => {
    return { label: item.name, id: `${item.id}` };
  });

  const handleChange = (e: any, values: OptionType[]) => {
    e.preventDefault();
    setFieldValue(name, values);
    setNewValue(values);
  };

  useEffect(() => {
    if (defaultValue && defaultValue[name]) {
      const defaultTeachers: OptionType[] = [];
      teachers?.results.forEach((item: any) => {
        if (defaultValue[name].includes(item.id))
          defaultTeachers.push({ label: item.name, id: `${item.id}` });
      });
      setNewValue(defaultTeachers);
      setFieldValue(name, defaultTeachers);
      return;
    }

    const defaultTeachers = teacher?.results.map((item: any) => {
      return { label: item.name, id: `${item.id}` };
    });
    setNewValue(defaultTeachers);
    setFieldValue(name, defaultTeachers);
  }, [defaultValue, name, setFieldValue, teacher, teachers?.results]);

  useEffect(() => {
    refetchTeacher();
  }, [teacher, refetchTeacher]);

  return (
    <>
      <Autocomplete
        size={size}
        multiple
        limitTags={2}
        disableCloseOnSelect
        isOptionEqualToValue={(option: OptionType, value: OptionType) =>
          option?.id === value?.id || value === undefined || value === null
        }
        getOptionLabel={(option: OptionType) => option?.label}
        options={TEACHERS ?? []}
        value={newValue || []}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label={label} error={!!showError} />
        )}
        onChange={handleChange}
      />
      <ErrorMessage name={name} component="p" className="error" />
    </>
  );
}
