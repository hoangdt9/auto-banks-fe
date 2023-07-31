import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import { userApi } from "../../../../api/tokenApi";
import { createStorage } from "../../../../utils/LocalStorage";

const GoogleSignin = () => {
  const clientId = String(process.env.REACT_APP_GOOGLE_CLIENT_ID);

  const navigate = useNavigate();
  const login = useMutation(userApi.loginGoogle);

  const onSuccess = (res: any) => {
    const { credential } = res;
    if (credential) {
      const auth_token = { auth_token: credential };
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

  const onFailure = () => {
    console.log("GoogleSignin", "[Login Failed]");
  };
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
        locale="vi"
        auto_select
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignin;
