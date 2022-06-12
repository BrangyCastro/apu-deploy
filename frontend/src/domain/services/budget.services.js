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

export const getBudgetAllsApi = async () => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/presupuesto`,
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

export const getBudgetPublicAllsApi = async () => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/presupuesto/publico`,
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

export const createBudgetApi = async (data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/presupuesto`,
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

export const uploadBudgetApi = async (file, id) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/presupuesto/${id}`,
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

export const updateBudgetApi = async (id, data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/presupuesto/${id}`,
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

export const deleteBudgetApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/presupuesto/${id}`,
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
