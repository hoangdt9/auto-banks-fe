import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import KeyIcon from "@mui/icons-material/Key";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Formik, FastField } from "formik";
import { useMutation } from "react-query";

import { LoginSchema } from "../../../../utils/validation";
import PasswordField from "../../../../custom-fields/PasswordField";
import InputField from "../../../../custom-fields/InputField";
import { userApi } from "../../../../api/tokenApi";
import { createStorage } from "../../../../utils/LocalStorage";
import GoogleSignin from "../../components/GoogleSignin";
import FacebookSignin from "../../components/FacebookSignin";
import "./styles.scss";

const theme = createTheme();

export const SignIn = () => {
  const navigate = useNavigate();
  const login = useMutation(userApi.login);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const params = {
      username: data.get("username"),
      password: data.get("password"),
    };

    login.mutate(params, {
      onSuccess: (currentUser) => {
        const storage = createStorage("citysports");
        storage.set("account", currentUser);
        navigate("/portal", { replace: true });
      },
      onError: (err: any) => {
        const { data } = err.response;
        alert(JSON.stringify(data));
      },
    });
  };

  const handleClickResetPassword = useCallback(
    () => navigate("/auth/email-reset", { replace: true }),
    [navigate]
  );

  const handleClickSignUp = useCallback(
    () => navigate("/auth/sign-up", { replace: true }),
    [navigate]
  );

  const initialValues = {
    username: "",
    password: "",
  } as React.FormEvent<HTMLFormElement> & {
    username: string;
    password: string;
  };

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
                my: 2,
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
                Đăng nhập
              </Typography>

              <Formik
                initialValues={initialValues}
                validationSchema={LoginSchema}
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
                        name="username"
                        component={InputField}
                        label="Tài Khoản"
                        multiline
                        Icon={ContactMailIcon}
                        helperText="Sử dụng địa chỉ email hoặc tên tài khoản của bạn"
                      />
                      <br />
                      <FastField
                        name="password"
                        component={PasswordField}
                        label="Mật khẩu"
                        placeholder=""
                        multiline
                        Icon={KeyIcon}
                      />
                      <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label={
                          <Typography className="divider">
                            Ghi nhớ tài khoản
                          </Typography>
                        }
                        sx={{ ml: 0.2 }}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mb: 2 }}
                      >
                        Đăng nhập
                      </Button>
                      <Grid container>
                        <Grid item xs>
                          <Link
                            href="#"
                            onClick={handleClickResetPassword}
                            variant="body2"
                          >
                            <Typography style={{ fontSize: 12 }}>
                              Quên mật khẩu?
                            </Typography>
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link
                            href="#"
                            variant="body2"
                            onClick={handleClickSignUp}
                          >
                            <Typography style={{ fontSize: 12 }}>
                              Đăng ký
                            </Typography>
                          </Link>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                }}
              </Formik>
            </Box>

            <Divider className="divider">
              Đăng nhập bằng tài khoản mạng xã hội
            </Divider>

            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{
                my: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item>
                <FacebookSignin />
              </Grid>
              <Grid item>
                <GoogleSignin />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
