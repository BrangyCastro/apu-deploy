import { API_KEY } from "../utils/constant";
import { HttpStatusCode, AxiosAuthorizeHttpClient } from "../protocols";
import {
  UnexpectedError,
  UnauthorizedError,
  AccessDeniedError,
  NotFoundError,
  ConfictError,
  BadRequest,
} from "../errors";

export const sendMailCredentialsApi = async (data) => {
  const { nombres, cedula, email } = data;
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/mail/docente/new/${nombres}/${cedula}/${email}`,
    method: "POST",
  });

  switch (responseAxios.statusCode) {
    case HttpStatusCode.create:
      return responseAxios.body;
    case HttpStatusCode.conflict:
      throw new ConfictError(responseAxios.body.message);
    case HttpStatusCode.unauthorized:
      throw new UnauthorizedError();
    case HttpStatusCode.forbidden:
      throw new AccessDeniedError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    case HttpStatusCode.notFound:
      throw new NotFoundError();
    default:
      throw new UnexpectedError();
  }
};
