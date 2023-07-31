import React, { useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import KeyIcon from "@mui/icons-material/Key";
import SaveIcon from "@mui/icons-material/Save";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Grid,
  Container,
  Paper,
  CssBaseline,
  Avatar,
  Typography,
} from "@mui/material";
import { Formik, Form, FastField } from "formik";
import { useMutation } from "react-query";

import { PasswordSchema } from "../../../../utils/validation";
import PasswordField from "../../../../custom-fields/PasswordField";
import userApi from "../../../../api/userApi";
import Popup from "../../../../components/Popup";
import "./styles.scss";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const uidb64 = searchParams.get("uidb64");
  const [loading, setLoading] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [haveOk, setHaveOk] = useState(true);

  const navigate = useNavigate();
  const resetPassword = useMutation(userApi.resetPassword);

  const initialValues = { password: "", passwordConfirm: "" };

  const handleSubmit = (values: any) => {
    const { password } = values;

    const params = {
      password: password,
      token: token,
      uidb64: uidb64,
    };

    setLoading(true);

    resetPassword.mutate(params, {
      onSuccess: (response) => {
        if (response.status === 200) {
          setHaveOk(true);
          setLoading(false);
          setOpen(true);
          setPopupContent("Mật khẩu của bạn đã được thay đổi");
          setPopupTitle(`Thành công`);
        }
      },
      onError: (errors: any) => {
        setHaveOk(false);
        setLoading(false);
        setOpen(true);
        setPopupContent("Đường dẫn này không hợp lệ");
        setPopupTitle(`Lỗi`);
      },
    });
  };

  const handleOk = useCallback(
    () => navigate("/auth/sign-in", { replace: true }),
    [navigate]
  );

  return (
    <Container>
      <Grid
        container
        component="main"
        sx={{
          height: "90vh",
          marginTop: "30px",
        }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          component={Paper}
          elevation={6}
          square
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ m: 1, color: "primary.main" }}
            >
              Cập nhật mật khẩu mới
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={PasswordSchema}
              onSubmit={handleSubmit}
            >
              {() => {
                // do something here ...
                return (
                  <Form>
                    <FastField
                      name="password"
                      component={PasswordField}
                      label="Mật khẩu"
                      Icon={KeyIcon}
                    />
                    <br />
                    <FastField
                      name="passwordConfirm"
                      component={PasswordField}
                      label="Xác nhận mật khẩu"
                      Icon={ConfirmationNumberIcon}
                    />
                    <Box sx={{ "& > button": { ml: 20, mt: 1 } }}>
                      <LoadingButton
                        type="submit"
                        size="small"
                        color="primary"
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                      >
                        Cập nhật
                      </LoadingButton>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Grid>
      </Grid>
      <Popup
        maxWidth={"xs"}
        open={open}
        setOpen={setOpen}
        popupTitle={popupTitle}
        popupContent={popupContent}
        handleOk={handleOk}
        haveOk={haveOk}
      />
    </Container>
  );
};

export default ResetPassword;
