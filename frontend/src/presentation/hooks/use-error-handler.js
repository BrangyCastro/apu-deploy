import { AccessDeniedError, UnauthorizedError } from "../../domain/errors";
import { logoutApi } from "../../domain/services/";

export const useErrorHandler = (callback) => {
  return (error) => {
    if (error instanceof AccessDeniedError) {
      logoutApi();
      window.location.reload();
    } else if (error instanceof UnauthorizedError) {
      logoutApi();
      window.location.reload();
    } else {
      callback(error);
    }
  };
};
