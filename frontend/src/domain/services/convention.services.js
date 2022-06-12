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

export const getConventionIdApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/convenio/alls/${id}`,
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

export const getConventionVendorsIdApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/convenio/${id}`,
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

export const createConventionApi = async (data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/convenio`,
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

export const uploadConventionApi = async (file, id) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/convenio/${id}`,
    method: "POST",
    body: formData,
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
    case HttpStatusCode.notFound:
      throw new NotFoundError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};

export const updateConventionApi = async (id, data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/convenio/${id}`,
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

export const deleteConventionApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/convenio/${id}`,
    method: "DELETE",
  });

  console.log(responseAxios);

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
