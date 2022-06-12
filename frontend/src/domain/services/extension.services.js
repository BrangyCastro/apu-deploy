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
import queryString from "query-string";

export const getExtensionApi = async (status) => {
  const queryObj = {};

  if (status?.length) {
    queryObj.status = status;
  }

  const queryStr = queryString.stringify(queryObj);

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/apuextension?${queryStr}`,
    method: "GET",
  });

  switch (responseAxios.statusCode) {
    case HttpStatusCode.ok:
      return responseAxios.body;
    case HttpStatusCode.unauthorized:
      throw new UnauthorizedError();
    case HttpStatusCode.forbidden:
      throw new AccessDeniedError();
    case HttpStatusCode.notFound:
      throw new NotFoundError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};

export const getExtensionIdApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/apuextension/${id}`,
    method: "GET",
  });

  switch (responseAxios.statusCode) {
    case HttpStatusCode.ok:
      return responseAxios.body;
    case HttpStatusCode.unauthorized:
      throw new UnauthorizedError();
    case HttpStatusCode.forbidden:
      throw new AccessDeniedError();
    case HttpStatusCode.notFound:
      throw new NotFoundError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};

export const createExtensionApi = async (data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/apuextension`,
    method: "POST",
    body: data,
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
    default:
      throw new UnexpectedError();
  }
};

export const updateExtensionApi = async (id, data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/apuextension/${id}`,
    method: "PATCH",
    body: data,
  });

  switch (responseAxios.statusCode) {
    case HttpStatusCode.ok:
      return responseAxios.body;
    case HttpStatusCode.conflict:
      throw new ConfictError(responseAxios.body.message);
    case HttpStatusCode.unauthorized:
      throw new UnauthorizedError();
    case HttpStatusCode.forbidden:
      throw new AccessDeniedError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};

export const deleteExtensionApi = async (id, status) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/apuextension/${id}/${status}`,
    method: "DELETE",
  });

  switch (responseAxios.statusCode) {
    case HttpStatusCode.ok:
      return responseAxios.body;
    case HttpStatusCode.conflict:
      throw new ConfictError(responseAxios.body.message);
    case HttpStatusCode.unauthorized:
      throw new UnauthorizedError();
    case HttpStatusCode.forbidden:
      throw new AccessDeniedError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};
