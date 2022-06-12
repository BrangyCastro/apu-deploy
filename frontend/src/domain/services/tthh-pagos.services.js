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
import * as moment from "moment";

export const getTthhPagosReportsUserApi = async (id, data) => {
  const dataTemp = {
    ...data,
    mesInicio: moment(data.mesInicio).format("YYYY-MM-DD"),
    mesFin: moment(data.mesFin).format("YYYY-MM-DD"),
  };

  const { mesInicio, mesFin } = dataTemp;

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos/fecha/${mesInicio}/${mesFin}/${id}`,
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

export const getTthhPagosIdApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos/details/${id}`,
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

export const getTthhPagosReportsApi = async (id, data) => {
  const dataTemp = {
    ...data,
    mesInicio: moment(data.mesInicio).format("YYYY-MM-DD"),
    mesFin: moment(data.mesFin).format("YYYY-MM-DD"),
  };

  const { mesInicio, mesFin } = dataTemp;

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos/report/${mesInicio}/${mesFin}/${id}`,
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

export const getTthhPagosReportsDetailsApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh/todos/nomina/${id}`,
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

export const getTthhPagosReportsIdApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh/todos/report/${id}`,
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

export const getAllsMesAnioTthhCustomApi = async (data) => {
  const dataTemp = {
    ...data,
    mes: moment(data.mes).format("YYYY-MM-DD"),
  };
  const { mes, status } = dataTemp;
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh/fecha/${mes}/${status}`,
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

export const getTthhDetailsIdApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh/todos/nomina/${id}`,
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

export const getTthhPagosReviewApi = async (data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos/review`,
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
    case HttpStatusCode.notFound:
      throw new NotFoundError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};

export const getTthhReviewApi = async (data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh/review`,
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
    case HttpStatusCode.notFound:
      throw new NotFoundError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};

export const createTthhApi = async (data) => {
  const dataTemp = {
    ...data,
    mes: moment(data.mesDescontar).format("YYYY-MM-DD"),
  };

  const { mes, aporte, file } = dataTemp;

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh/csv/${mes}/${aporte}`,
    method: "POST",
    body: file,
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

export const createTthhPagoApi = async (data) => {
  const dataTemp = {
    ...data,
    obser: data.observacion,
    mes: moment(data.mesDescontar).format("YYYY-MM-DD"),
  };

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos`,
    method: "POST",
    body: dataTemp,
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

export const generateChargesTthhApi = async (data) => {
  const dataTemp = {
    ...data,
    mesDescontar: moment(data.mesDescontar).format("YYYY-MM-DD"),
  };
  const { mesDescontar, aporte } = dataTemp;

  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh/generar/${mesDescontar}/${aporte}`,
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
    case HttpStatusCode.notFound:
      throw new NotFoundError();
    case HttpStatusCode.badRequest:
      throw new BadRequest(responseAxios.body.message);
    default:
      throw new UnexpectedError();
  }
};

export const sendEmailReportApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos/email/${id}`,
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
    default:
      throw new UnexpectedError();
  }
};

export const sendEmailReportAllsApi = async (data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos/email`,
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

export const updateTthhDetailsApi = async (id, data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh/${id}`,
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

export const updateStatusTthhPagosApi = async (data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos`,
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

export const updateTthhPagosApi = async (id, data) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos/${id}`,
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

export const deleteTthhPagosIdApi = async (id) => {
  const responseAxios = await AxiosAuthorizeHttpClient({
    url: `${API_KEY}/tthh-pagos/${id}`,
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
