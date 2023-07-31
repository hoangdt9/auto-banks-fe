import { useCallback, useState } from "react";
import { Formik, FastField } from "formik";
import {
  Box,
  Grid,
  Container,
  Paper,
  CssBaseline,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import userApi from "../../../../api/userApi";
import Popup from "../../../../components/Popup";
import InputField from "../../../../custom-fields/InputField";
import { EmailSchema } from "../../../../utils/validation";
import "./styles.scss";

const ForgotPassword = () => {
  const [open, setOpen] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [haveOk, setHaveOk] = useState(true);

  const navigate = useNavigate();
  const resetEmail = useMutation(userApi.resetEmail);

  const handleSubmit = async (values: any) => {
    const { email } = values;
    const params = { email: email };

    resetEmail.mutate(params, {
      onSuccess: (response) => {
        if (response.status === 200) {
          setHaveOk(true);
          setOpen(true);
          setPopupContent(
            "Vui lòng kiểm tra email của bạn để thay đổi mật khẩu"
          );
          setPopupTitle("Thành công");
        }
      },
      onError: (errors: any) => {
        const { data } = errors?.response;

        setHaveOk(false);
        setOpen(true);
        setPopupContent(data?.error);
        setPopupTitle("Lỗi");
      },
    });
  };

  const handleOk = useCallback(
    () => navigate("/auth/sign-in", { replace: true }),
    [navigate]
  );

  const initialValues = { email: "" };

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
              Bạn quên mật khẩu?
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={EmailSchema}
              onSubmit={handleSubmit}
            >
              {(props) => {
                const { handleSubmit } = props;

                return (
                  <Box
                    component="form"
                    sx={{ "& > button": { ml: 20, mt: 1 } }}
                    onSubmit={handleSubmit}
                  >
                    <FastField
                      name="email"
                      component={InputField}
                      label="Email"
                      placeholder=""
                    />
                    <Button
                      type="submit"
                      size="small"
                      variant="contained"
                      endIcon={<SendIcon />}
                    >
                      Gửi
                    </Button>
                  </Box>
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

export default ForgotPassword;
