import { AttachMoney, Percent } from "@mui/icons-material";

export const STUDENT_TABLE = [
  { name: "name", label: "Họ tên", fieldType: "InputField", Icon: "" },
  { name: "parents", label: "Phụ huynh", fieldType: "InputField" },
  { name: "dob", label: "Ngày sinh", fieldType: "DateTimeField" },
  { name: "register_date", label: "Ngày đăng ký", fieldType: "DateTimeField" },
  {
    name: "status",
    label: "Trạng thái",
    fieldType: "AutocompleteField",
    option: "statusList",
  },
  { name: "phone", label: "Số điện thoại", fieldType: "InputField" },
  { name: "email", label: "Email", fieldType: "InputField" },
  { name: "facebook", label: "Facebook", fieldType: "InputField" },
  {
    name: "address",
    label: "Địa chỉ",
    fieldType: "InputField",
    multiline: true,
  },
];

export const STUDENT_FEE = [
  {
    name: "fee.amount",
    label: "Số tiền",
    fieldType: "InputField",
    Icon: AttachMoney,
    type: "number",
    inputProps: { min: 0, step: 50000 },
  },
  {
    name: "fee.unit_num",
    label: "Số buổi học",
    fieldType: "InputField",
    type: "number",
    inputProps: { min: 0 },
  },
  {
    name: "fee.discount",
    label: "Giảm giá",
    fieldType: "InputField",
    type: "number",
    Icon: Percent,
    inputProps: { min: 0, step: 5 },
  },
  {
    name: "fee.gift",
    label: "Quà tặng",
    fieldType: "AutocompleteField",
    option: "gift",
  },
  { name: "fee.pay_date", label: "Ngày đóng tiền", fieldType: "DateTimeField" },
  { name: "fee.start_date", label: "Ngày bắt đầu", fieldType: "DateTimeField" },
  {
    name: "fee.end_date",
    label: "Ngày kết thúc dự kiến",
    fieldType: "DateTimeField",
    disabled: true,
  },
  {
    name: "used_rest",
    label: "Số buổi đã học/còn lại",
    fieldType: "InputField",
    disabled: true,
  },
];
