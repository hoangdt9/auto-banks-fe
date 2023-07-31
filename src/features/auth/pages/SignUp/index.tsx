import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  CssBaseline,
  Button,
  Avatar,
} from "@mui/material";
import { Formik, FastField } from "formik";
import { useMutation } from "react-query";

import { SignUpSchema } from "../../../../utils/validation";
import PasswordField from "../../../../custom-fields/PasswordField";
import InputField from "../../../../custom-fields/InputField";
import userApi from "../../../../api/userApi";
import Popup from "../../../../components/Popup";

const theme = createTheme();

export const SignUp = () => {
  const registerNewUser = useMutation(userApi.register);
  const [showPopup, setshowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [haveOk, setHaveOk] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const params = {
      email: data.get("email"),
      username: data.get("userName"),
      password: data.get("password"),
    };

    registerNewUser.mutate(params, {
      onSuccess: (response) => {
        setHaveOk(true);
        setshowPopup(true);
        setPopupTitle("Đăng ký thành công");
        setPopupContent(
          `Chúng tôi đã gửi email xác nhận đến ${response.data.email} .Bạn hãy xác thực để sử dụng tài khoản.`
        );
      },
      onError: (errors: any) => {
        setHaveOk(false);
        setshowPopup(true);
        setPopupTitle("Lỗi");
        let error = "";
        for (const key in errors.response.data.errors) {
          const values = errors.response.data.errors[key][0];
          error += values + `\n`;
        }

        setPopupContent(error);
      },
    });
  };

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    userName: "",
    password: "",
  } as React.FormEvent<HTMLFormElement> & {
    email: string;
    userName: string;
    password: string;
  };

  const handleOk = useCallback(
    () => navigate("/auth/sign-in", { replace: true }),
    [navigate]
  );

  return (
    <ThemeProvider theme={theme}>
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
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Formik
                initialValues={initialValues}
                validationSchema={SignUpSchema}
                onSubmit={handleSubmit}
              >
                {(formikProps) => {
                  return (
                    <Box
                      component="form"
                      noValidate
                      onSubmit={handleSubmit}
                      sx={{ mt: 1 }}
                    >
                      <FastField
                        name="email"
                        component={InputField}
                        label="Email"
                        placeholder=""
                        multiline
                        Icon={EmailIcon}
                      />
                      <br />
                      <FastField
                        name="userName"
                        component={InputField}
                        label="Tên người dùng"
                        placeholder=""
                        multiline
                        Icon={PersonIcon}
                      />
                      <br />
                      <FastField
                        name="password"
                        component={PasswordField}
                        label="Mật khẩu"
                        multiline
                        Icon={KeyIcon}
                      />
                      <br />
                      <FastField
                        name="passwordConfirm"
                        component={PasswordField}
                        label="Xác nhận mật khẩu"
                        multiline
                        Icon={ConfirmationNumberIcon}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Sign Up
                      </Button>
                    </Box>
                  );
                }}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Popup
        maxWidth={"xs"}
        open={showPopup}
        setOpen={setshowPopup}
        popupTitle={popupTitle}
        popupContent={popupContent}
        handleOk={handleOk}
        haveOk={haveOk}
      />
    </ThemeProvider>
  );
};
