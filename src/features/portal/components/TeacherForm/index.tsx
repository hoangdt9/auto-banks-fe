import React, { useEffect, useState } from "react";
import { Grid, Divider, DialogActions, Button, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { FastField, Formik } from "formik";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

import InputField from "../../../../custom-fields/InputField";
import DateTimeField from "../../../../custom-fields/DateTimeField";
import AutocompleteField from "../../../../custom-fields/AutocompleteField";
import { TEACHER_TABLE } from "./TEACHER_TABLE";
import teacherApi from "../../../../api/teacherApi";
import Popup from "../../../../components/Popup";
import { TeacherFormSchema } from "../../../../utils/validation";

export interface ITeacher {
  teacher_id: string;
  name: string;
  role: string;
  start_date: Date;
  salary: number;
  allowance: number;
  phone: string;
  seniority: number;
}

interface IProps {
  setActive: React.Dispatch<React.SetStateAction<any>>;
}

const TeacherForm = (props: IProps): JSX.Element => {
  const { setActive } = props;
  const { state }: any = useLocation();
  const teacher = state?.teacher;

  const [showPopup, setshowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");

  const navigate = useNavigate();

  const initialValues = {
    teacher_id: teacher?.teacher_id ?? "",
    name: teacher?.name ?? "",
    role: teacher?.role ?? "",
    start_date: teacher?.start_date ?? null,
    salary: teacher?.salary ?? 0,
    allowance: teacher?.allowance ?? 0,
    phone: teacher?.phone ?? "",
    seniority: teacher?.seniority ?? 0,
  } as React.FormEvent<HTMLFormElement> & ITeacher;

  const registerNewTeacher = useMutation(teacherApi.registerNewTeacher, {
    onMutate: () => {},
    onSuccess: (response) => {
      setshowPopup(true);
      setPopupTitle("Huấn Luyện Viên");
      setPopupContent("Đăng ký thành công");
    },
    onError: (err: any) => {
      const { data } = err.response;

      setshowPopup(true);
      setPopupTitle("Huấn Luyện Viên");
      setPopupContent(data?.error);
    },
  });

  const updateTeacher = useMutation(teacherApi.updateTeacher, {
    onSuccess: (response) => {
      setshowPopup(true);
      setPopupTitle("Huấn Luyện Viên ");
      setPopupContent("Cập nhật thành công");
    },
    onError: () => navigate("/teacher"),
  });

  const handleSubmit = async (values: ITeacher) => {
    const { teacher_id } = values;

    const params: any = {
      ...values,
      id: teacher?.id,
    };

    if (teacher?.teacher_id === teacher_id) delete params["teacher_id"];

    if (teacher) {
      updateTeacher.mutate(params);
    } else {
      registerNewTeacher.mutate(params);
    }
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

  const navigateTeacher = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate("/teacher");
  };

  useEffect(() => {
    setActive({ teacher: "active" });
  }, []);

  return (
    <Grid container>
      <Formik
        initialValues={initialValues}
        validationSchema={TeacherFormSchema}
        onSubmit={handleSubmit}
      >
        {(props) => {
          const { handleSubmit, isSubmitting } = props;
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
                {TEACHER_TABLE.map((item, index) => (
                  <Grid item xs={12} sm={4} md={4} key={index}>
                    <FastField
                      name={item?.name}
                      component={renderComponent(item?.fieldType)}
                      label={item?.label}
                      Icon={item.Icon ?? null}
                    />
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ mb: 4, mt: 2 }} />

              <DialogActions>
                <Button variant="outlined" onClick={navigateTeacher}>
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
        maxWidth={"xs"}
        open={showPopup}
        setOpen={setshowPopup}
        popupTitle={popupTitle}
        popupContent={popupContent}
        handleOk={() => navigate("/teacher")}
        haveOk={true}
      />
    </Grid>
  );
};

export default TeacherForm;
