import { createStorage } from "./LocalStorage";
import jwt_decode from "jwt-decode";
import tokenApi from "../api/tokenApi";

const getAuth = () => {
  const storage = createStorage("citysports");
  const currentUser = storage.getAccount();

  if (!currentUser) return;

  const auth = {
    tokens: currentUser?.tokens,
    getToken: async () => {
      if (!currentUser) return;

      const refreshToken: any = jwt_decode(currentUser?.tokens?.refresh);
      const accessToken: any = jwt_decode(currentUser?.tokens?.access);

      const refreshExp = refreshToken?.exp * 1000;
      const accessExp = accessToken?.exp * 1000;
      const now = Date.now();

      if (refreshExp - now < 10000) return;
      else if (accessExp - now < 10000) {
        const param = { refresh: currentUser?.tokens?.refresh };
        try {
          const token = await tokenApi.refresh(param);

          currentUser.tokens.access = token.access;
          storage.set("account", currentUser);

          return token.access;
        } catch (error) {
          return;
        }
      }

      return currentUser?.tokens?.access;
    },
  };

  return auth;
};

const onAuthStateChanged = (user: object, callback: Function) => {
  callback(user);
};

export { getAuth, onAuthStateChanged };
