import { API_KEY } from "../utils/constant";
import { DataURIToBlob } from "../utils/shared";
import { HttpStatusCode, AxiosAuthorizeHttpClient } from "../protocols";
import {
  UnexpectedError,
  UnauthorizedError,
  AccessDeniedError,
  NotFoundError,
  ConfictError,
  BadRequest,
  NotAcceptableError,
} from "../errors";
import queryString from "query-string";

export const getVendorsApi = async (data) => {
  const { status, publico, keyboard, userId } = data;

  const queryObj = {};

  if (status?.length) {
    queryObj.status = status;
  }

  if (publico) {
    queryObj.publico = publico;
  }

  if (userId) {
    queryObj.userId = userId;
  }

  if (keyboard?.length) {
    queryObj.keyboard = keyboard;
  }

  const queryStr = queryString.stringify(queryObj);

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/proveedor?${queryStr}`,
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

export const getVendorsApuApi = async () => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/apuextension?status=ACTIVE`,
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

export const getVendorsIdApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/proveedor/${id}`,
    method: "GET",
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
    case HttpStatusCode.notFound:
      throw new NotFoundError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};

export const getVendorsAndUserIdApi = async (id, userId) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/proveedor/prove/${id}/${userId}`,
    method: "GET",
  });

  switch (responseAxios.statusCode) {
    case HttpStatusCode.ok:
      return responseAxios.body;
    case HttpStatusCode.conflict:
      throw new ConfictError(responseAxios.body.message);
    case HttpStatusCode.notAcceptable:
      throw new NotAcceptableError(responseAxios.body.message);
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

export const createVendorsApi = async (data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/proveedor`,
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

export const updateVendorsApi = async (id, data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/proveedor/${id}`,
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

export const updateAvatarVendorsApi = async (imgBase64, fileName, id) => {
  const file = DataURIToBlob(imgBase64);
  const formData = new FormData();
  formData.append("img", file, fileName);

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/proveedor/${id}`,
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
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};

export const deleteVendorsApi = async (id, status) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/proveedor/${id}/${status}`,
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
