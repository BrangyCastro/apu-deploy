import axios from "axios";
import { getTokenApi } from "../../services";

export const AxiosAuthorizeHttpClient = async (data) => {
  let axiosResponse = "";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getTokenApi()}`,
  };
  try {
    axiosResponse = await axios.request({
      url: data.url,
      method: data.method,
      data: data.body,
      headers,
    });
  } catch (error) {
    axiosResponse = error.response;
  }

  return {
    statusCode: axiosResponse.status,
    body: axiosResponse.data,
  };
};
