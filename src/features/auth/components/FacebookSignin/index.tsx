import FacebookLogin from "react-facebook-login";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import { userApi } from "../../../../api/tokenApi";
import { createStorage } from "../../../../utils/LocalStorage";
import "./styles.scss";

const FacebookSignin = () => {
  const appId = String(process.env.REACT_APP_FACEBOOK_APP_ID);

  const navigate = useNavigate();
  const login = useMutation(userApi.loginFacebook);

  const responseFacebook = async (response: any) => {
    const { accessToken } = response;

    if (accessToken) {
      const auth_token = { auth_token: accessToken };

      login.mutate(auth_token, {
        onSuccess: (response) => {
          const { data } = response;
          const storage = createStorage("citysports");
          storage.set("account", data);
          navigate("/portal", { replace: true });
        },
        onError: (error: any) => {
          alert(error.response.data.message);
        },
      });
    }
  };

  const handleClick = (response: any) => {
    console.log("handleClick", response);
  };

  return (
    <FacebookLogin
      appId={appId}
      autoLoad={false}
      fields="name,email,picture"
      onClick={handleClick}
      callback={responseFacebook}
      cssClass="btnFacebook"
      icon="fa-facebook"
      textButton="&nbsp;&nbsp;Đăng nhập bằng Facebook"
    />
  );
};

export default FacebookSignin;
