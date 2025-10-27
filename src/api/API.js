import axios from "axios";
import { API_BASE_URL } from "../config/config";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically to requests
API.interceptors.request.use(
  (config) => {
    const UserData = JSON.parse(localStorage.getItem("UserData") || "{}");
    const token = UserData?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global unauthorized (401) handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized — redirecting to login...");

      // remove all user data
      localStorage.removeItem("UserData");

      // force redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;

// import axios from "axios";
// import { API_BASE_URL } from "../config/config";

// const API = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add interceptor to attach token to every request
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");

//     if (token) {
//       // config.headers.Authorization = Token ${token};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add interceptor for automatic logout if token is invalid
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log("Unauthorized — redirecting to login...");
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("UserData");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;

// function getIRequestProp() {
//   let userData = JSON.parse(localStorage.getItem("userData"));
//   let accessToken = userData && userData["access"] ? userData["access"] : "";

//   return {
//     serverUrl: API_BASE_URL,
//     requestHeader: {
//       "Content-Type": "application/json",
//       "Accept-Language": "en",
//       Authorization: accessToken ? `Bearer ${accessToken}` : "",
//     },
//   };
// }

// async function get(url, parameter) {
//   const { serverUrl, requestHeader } = getIRequestProp();
//   return axios.get(serverUrl + url, {
//     params: parameter,
//     headers: requestHeader,
//   });
// }

// async function postGoogleAPI(url, body) {
//   const { serverUrl, requestHeader } = getIRequestProp();
//   return axios.post(serverUrl + url, body, {
//     headers: requestHeader,
//   });
// }

// async function post(url, body) {
//   const { serverUrl, requestHeader } = getIRequestProp();
//   return axios.post(serverUrl + url, body, {
//     headers: requestHeader,
//   });
// }

// async function put(url, body) {
//   const { serverUrl, requestHeader } = getIRequestProp();
//   return axios.put(serverUrl + url, body, {
//     headers: requestHeader,
//   });
// }

// async function patch(url, body) {
//   const { serverUrl, requestHeader } = getIRequestProp();
//   return axios.patch(serverUrl + url, body, {
//     headers: requestHeader,
//   });
// }

// async function remove(url, body) {
//   const { serverUrl, requestHeader } = getIRequestProp();
//   return axios.delete(serverUrl + url, {
//     data: body,
//     headers: requestHeader,
//   });
// }

// const API = {
//   get,
//   post,
//   put,
//   patch,
//   remove,
//   postGoogleAPI,
// };
// export default API;
