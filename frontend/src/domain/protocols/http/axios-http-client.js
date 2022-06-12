import axios from "axios";

export const AxiosHttpClient = async (data) => {
  let axiosResponse = "";
  try {
    axiosResponse = await axios.request({
      url: data.url,
      method: data.method,
      data: data.body,
      headers: data.headers,
    });
  } catch (error) {
    axiosResponse = error.response;
  }

  return {
    statusCode: axiosResponse.status,
    body: axiosResponse.data,
  };
};
