export const CLASS_TABLE_ROW_1 = [
  { name: "name", label: "Tên lớp", fieldType: "InputField" },
  {
    name: "day_of_week",
    label: "thứ",
    fieldType: "SelectField",
    option: "dowList",
  },
  { name: "start_at", label: "Giờ bắt đầu", fieldType: "TimePickerField" },
  { name: "end_at", label: "Giờ kết thúc", fieldType: "TimePickerField" },
];

export const CLASS_TABLE_ROW_2 = [
  {
    name: "type",
    label: "Loại lớp",
    fieldType: "SelectField",
    option: "typeList",
  },
  {
    name: "is_open",
    label: "Trạng thái",
    fieldType: "SelectField",
    option: "statusList",
  },
];

export const CLASS_TABLE_ROW_3 = {
  name: "teacher",
  label: "Huấn luyện viên",
  fieldType: "ManyTeacherSelectField",
};
