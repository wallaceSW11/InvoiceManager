import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { loading } from "./loading";
import { notify } from "./notify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

function addAuthTokenToRequest(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

function showLoadingForMutations(config: InternalAxiosRequestConfig) {
  if (config.method !== "get") {
    loading(true, "Processing...");
  }
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    addAuthTokenToRequest(config);
    showLoadingForMutations(config);
    return config;
  },
  (error: AxiosError) => {
    loading(false);
    return Promise.reject(error);
  }
);

function handleUnauthorized() {
  notify("error", "Unauthorized", "Please log in again");
  localStorage.removeItem("auth_token");
  window.location.href = "/login";
}

function handleErrorResponse(error: AxiosError) {
  if (!error.response) {
    if (error.request) {
      notify("error", "Network Error", "Unable to connect to the server");
    } else {
      notify("error", "Error", error.message);
    }
    return;
  }

  const status = error.response.status;
  const message = (error.response.data as any)?.message || "An error occurred";

  switch (status) {
    case 401:
      handleUnauthorized();
      break;
    case 403:
      notify(
        "error",
        "Forbidden",
        "You do not have permission to perform this action"
      );
      break;
    case 404:
      notify("error", "Not Found", "The requested resource was not found");
      break;
    case 500:
      notify(
        "error",
        "Server Error",
        "Internal server error. Please try again later."
      );
      break;
    default:
      notify("error", "Error", message);
  }
}

api.interceptors.response.use(
  (response: AxiosResponse) => {
    loading(false);
    return response;
  },
  (error: AxiosError) => {
    loading(false);
    handleErrorResponse(error);
    return Promise.reject(error);
  }
);

export default api;
