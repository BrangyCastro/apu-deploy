// import { API_HOST, AVATAR_TOKEN } from "../utils/constant";
import { API_KEY, ACCESS_TOKEN } from "../utils/constant";
import jwtDecode from "jwt-decode";
import { HttpStatusCode, AxiosHttpClient } from "../protocols";
import { UnexpectedError, InvalidCredentialsError } from "../errors";

export const signIn = async (user) => {
  const responseAxios = await AxiosHttpClient({
    url: `${API_KEY}/auth/signin`,
    method: "POST",
    body: user,
  });

  switch (responseAxios.statusCode) {
    case HttpStatusCode.create:
      setTokenApi(responseAxios.body.accessToken);
      return responseAxios.body;
    case HttpStatusCode.unauthorized:
      throw new InvalidCredentialsError();
    default:
      throw new UnexpectedError();
  }
};

// export const changePasswordUsers = async (params) => {
//   const responseAxios = await AxiosHttpClient({
//     url: `${API_HOST}/auth/changePassword`,
//     method: "PATCH",
//     body: params,
//     headers: {
//       Authorization: `Bearer ${params.token}`,
//     },
//   });

//   switch (responseAxios.statusCode) {
//     case HttpStatusCode.ok:
//       return responseAxios.body;
//     case HttpStatusCode.unauthorized:
//       throw new InvalidCredentialsError();
//     default:
//       throw new UnexpectedError();
//   }
// };

export function isUserLogedApi() {
  const token = getTokenApi();

  if (token === "undefined") {
    logoutApi();
    return null;
  }

  if (!token) {
    logoutApi();
    return null;
  }
  if (isExpired(token)) {
    logoutApi();
    return null;
  }
  return jwtDecode(token);
}

// export function setAvatarToken(token) {
//   const datos = jwtDecode(token);
//   return localStorage.setItem(AVATAR_TOKEN, datos.avatar);
// }

export function setTokenApi(token) {
  return localStorage.setItem(ACCESS_TOKEN, token);
}

export function getTokenApi() {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function logoutApi() {
  localStorage.removeItem(ACCESS_TOKEN);
  // localStorage.removeItem("avatar");
}

export function isExpired(token) {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  const expire = exp * 1000;
  const timeout = expire - Date.now();

  if (timeout < 0) {
    return true;
  }
  return false;
}

export function isDecodeToken(token) {
  if (!token) return 0;
  return jwtDecode(token);
}
