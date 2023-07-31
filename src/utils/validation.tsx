import * as Yup from "yup";

const phoneRegExp = /^\+?1?\d{9,15}$/;

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Không được để trống"),
  password: Yup.string().required("Không được để trống"),
});

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Mật khẩu phải nhiều hơn 6 kí tự")
    .required("Không được để trống"),
  passwordConfirm: Yup.string().oneOf(
    [Yup.ref("password")],
    "Mật khẩu không trùng khớp"
  ),
});

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Không được để trống"),
  userName: Yup.string().required("Không được để trống"),
  password: Yup.string()
    .min(6, "Mật khẩu phải nhiều hơn 6 kí tự")
    .required("Không được để trống"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không trùng khớp")
    .required("Không được để trống"),
});

const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Không được để trống"),
});

const StudentFormSchema = Yup.object().shape({
  name: Yup.string().required("Không được để trống"),
  phone: Yup.string()
    .matches(phoneRegExp, "Số điện thoại không hợp lệ")
    .required("Không được để trống"),
  // class: Yup.number().required("Không được để trống"),
});

const TeacherFormSchema = Yup.object().shape({
  name: Yup.string().required("Không được để trống"),
  phone: Yup.string()
    .matches(phoneRegExp, "Số điện thoại không hợp lệ")
    .required("Không được để trống"),
});

const AttendanceSchema = Yup.object().shape({
  class: Yup.object().required("Không được để trống").nullable(),
  teacher: Yup.array().min(1, "Không được để trống").nullable(),
  location: Yup.object().required("Không được để trống").nullable(),
  date: Yup.date().required("Không được để trống"),
});

const BankSchema = Yup.object().shape({
  username: Yup.string().required("is not empty!"),
  password: Yup.string().required("is not empty!"),
  fromDate: Yup.date().required("is not empty!"),
  toDate: Yup.date().required("is not empty!"),
});

export {
  LoginSchema,
  PasswordSchema,
  EmailSchema,
  SignUpSchema,
  StudentFormSchema,
  TeacherFormSchema,
  AttendanceSchema,
  BankSchema,
};
