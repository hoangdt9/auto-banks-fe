import { useEffect, useState } from "react";
import { Grid, Divider, DialogActions, Button, Avatar } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Box } from "@mui/system";
import SaveIcon from "@mui/icons-material/Save";
import { FastField, Field, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import dayjs from "dayjs";

import InputField from "../../../../custom-fields/InputField";
import DateTimeField from "../../../../custom-fields/DateTimeField";
import AutocompleteField, { OptionType } from "../../../../custom-fields/AutocompleteField";
import ClassField from "../../../../custom-fields/ClassField";
import { STUDENT_FEE, STUDENT_TABLE } from "./STUDENT_TABLE";
import studentApi from "../../../../api/studentApi";
import classApi from "../../../../api/classApi";
import Popup from "../../../../components/Popup";
import { StudentFormSchema } from "../../../../utils/validation";
import { STUDENT_STATUS } from "../../../../constants/CommonConstant";
import { IClass } from "../../../../types";

interface IStudent {
  id: number;
  name: string;
  dob: Date | string;
  register_date: Date;
  status: any;
  parents: string;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  note: string;
  fee: {
    gift: any;
    amount: number;
    discount: number;
    end_date: Date;
    pay_date: Date;
    unit_num: number;
    unit_used?: number;
    start_date: Date;
  };
  student_id: number;
  avatar: any;
  used_rest: string;
  classes: any;
}

interface IProps {
  setActive: React.Dispatch<React.SetStateAction<any>>;
}

export interface IClassroom {
  class_id: string;
  id: number;
  is_open: boolean;
  start_at: string;
  end_at: string;
  day_of_week: number;
  location_name: string;
  name: string;
  student: Array<number>;
  teacher: Array<number>;
  type: string;
}

const STATUS: OptionType[] = Array.from(STUDENT_STATUS).map(([key, value]) => {
  return { label: value, id: key };
});

const GIFT: OptionType[] = [
  { label: "Đồng phục", id: "uniform" },
  { label: "Bóng", id: "ball" },
  { label: "Ba lô", id: "backpack" },
  { label: "Băng tay chân bảo vệ", id: "gear" },
  { label: "Quà tặng khác", id: "other" },
];

const StudentForm = (props: IProps): JSX.Element => {
  const { setActive } = props;
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const student: IStudent = state?.student;
  const usedUnit = student?.fee.unit_used ?? 0;

  const [selectedImage, setSelectedImage] = useState();
  const [showPopup, setshowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [haveOk, setHaveOk] = useState(true);

  const { data: classData } = useQuery("allClass", () =>
    classApi.getClasses("", "", "")
  );

  const CLASSES: IClass[] = classData?.results ?? [];

  const initialValues = {
    name: student?.name ?? "",
    dob: student?.dob ?? null,
    register_date: student?.register_date ?? null,
    status: student?.status
      ? { id: student?.status, label: STUDENT_STATUS.get(student?.status) }
      : null,
    parents: student?.parents ?? "",
    address: student?.address ?? "",
    phone: student?.phone ?? "",
    email: student?.email ?? "",
    facebook: student?.facebook ?? "",
    note: student?.note ?? "",
    fee: student?.fee ?? {
      gift: student?.fee?.gift ?? null,
      amount: student?.fee?.amount ?? 0,
      discount: student?.fee?.discount ?? 0,
      end_date: dayjs(student?.fee?.end_date).format("YYYY-MM-DD"),
      pay_date: dayjs(student?.fee?.pay_date).format("YYYY-MM-DD"),
      unit_num: student?.fee?.unit_num ?? 0,
      start_date: dayjs(student?.fee?.start_date).format("YYYY-MM-DD"),
    },
    student_id: student?.id,
    avatar: null,
    used_rest: `${usedUnit} / ${student?.fee.unit_num - usedUnit}`,
    classes: null,
  } as React.FormEvent<HTMLFormElement> & IStudent;

  const registerNewStudent = useMutation(studentApi.registerNewStudent, {
    onSuccess: (response) => {
      setshowPopup(true);
      setHaveOk(true);
      setPopupTitle("Học Sinh");
      setPopupContent("Đăng ký thành công");
    },
    onError: (err: any, variables, snapshotValue) => {
      //err is not the response from the server.
      const { data } = err.response;

      setshowPopup(true);
      setHaveOk(false);
      setPopupTitle("Học Sinh");
      setPopupContent(data?.error);
    },
  });

  const updateStudent = useMutation(studentApi.updateStudent, {
    onSuccess: (response) => {
      setshowPopup(true);
      setHaveOk(true);
      setPopupTitle("Học Sinh");
      setPopupContent("Cập nhật thành công");
    },
    onError: () => navigate("/student"),
  });

  const handleSubmit = async (values: IStudent) => {
    const { status, fee, name, phone, classes } = values;
    const class_id = classes?.map((c: any) => c.id);

    const params: any = {
      ...values,
      status: status?.id,
      fee: JSON.stringify(fee),
      classes: JSON.stringify(class_id),
    };

    if (!student || (selectedImage && params)) params.avatar = selectedImage;
    else delete params.avatar;

    if (student && student.name === name) delete params["name"];
    if (student && student.phone === phone) delete params["phone"];

    if (student) {
      updateStudent.mutate(params);
    } else {
      registerNewStudent.mutate(params);
    }
  };

  const uploadAvatar = (e: any) => {
    e.preventDefault();
    setSelectedImage(e.target.files[0]);
  };

  const renderComponent = (type: string) => {
    switch (type) {
      case "InputField":
        return InputField;
      case "DateTimeField":
        return DateTimeField;
      case "AutocompleteField":
        return AutocompleteField;

      default:
        return type;
    }
  };

  const renderOptions = (type: string | undefined) => {
    switch (type) {
      case "statusList":
        return STATUS;
      case "gift":
        return GIFT;
      default:
        break;
    }
  };

  const navigateStudent = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate("/student");
  };

  const handleOk = () => {
    navigate("/student");
  };

  useEffect(() => {
    setActive({ student: "active" });
  }, [setActive]);

  return (
    <Grid container>
      <Formik
        initialValues={initialValues}
        validationSchema={StudentFormSchema}
        onSubmit={handleSubmit}
      >
        {(props) => {
          const { handleSubmit, isSubmitting, values } = props;
          const { end_date } = values?.fee;
          return (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 4, mx: 2 }}
              noValidate
            >
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                <Grid item sx={{ mt: -3 }}>
                  <Avatar
                    sx={{ width: 90, height: 90 }}
                    alt="avatar"
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : student?.avatar ?? ""
                    }
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    component="label"
                    endIcon={<PhotoCamera />}
                    sx={{ m: 1 }}
                  >
                    Chọn ảnh
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={uploadAvatar}
                    />
                  </Button>
                </Grid>

                {STUDENT_TABLE.map((item, index) => (
                  <Grid item xs={12} sm={4} md={4} key={index}>
                    <FastField
                      name={item?.name}
                      component={renderComponent(item?.fieldType)}
                      label={item?.label}
                      options={renderOptions(item?.option)}
                      Icon={item.Icon ?? null}
                      multiline={item?.multiline}
                    />
                  </Grid>
                ))}

                {/* ClassField */}
                <Field
                  name="classes"
                  component={ClassField}
                  label="Lớp đã chọn"
                  options={CLASSES}
                  student={student}
                />
              </Grid>

              <Divider sx={{ mb: 2, mt: 4 }}>Học phí</Divider>

              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 12, md: 12 }}
              >
                {STUDENT_FEE.map((item, index) => (
                  <Grid item xs={4} sm={4} md={3} key={index}>
                    {(item?.name !== "fee.end_date" || end_date) &&
                      (item?.name !== "used_rest" || (student && end_date)) && (
                        <Field
                          name={item?.name}
                          component={renderComponent(item?.fieldType)}
                          label={item?.label}
                          options={renderOptions(item?.option)}
                          Icon={item.Icon ?? null}
                          type={item?.type}
                          inputProps={item?.inputProps}
                          disabled={item.disabled}
                          student_id={student?.id}
                        />
                      )}
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ mb: 4, mt: 2 }} />

              <Grid item sx={{ mb: 4 }}>
                <FastField
                  name={"note"}
                  component={InputField}
                  label={"Ghi chú"}
                  multiline
                  rows={4}
                />
              </Grid>

              <DialogActions>
                <Button variant="outlined" onClick={navigateStudent}>
                  Đóng
                </Button>
                <LoadingButton
                  type="submit"
                  autoFocus
                  loading={isSubmitting}
                  loadingPosition="end"
                  endIcon={<SaveIcon />}
                  variant="contained"
                >
                  Lưu
                </LoadingButton>
              </DialogActions>
            </Box>
          );
        }}
      </Formik>

      <Popup
        maxWidth="sm"
        open={showPopup}
        setOpen={setshowPopup}
        popupTitle={popupTitle}
        popupContent={popupContent}
        handleOk={handleOk}
        haveOk={haveOk}
      />
    </Grid>
  );
};

export default StudentForm;
