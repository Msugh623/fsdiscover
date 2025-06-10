import axios from "axios";

// Run "npm start" in ../../ to get host origin for use in development
export const baseUrl = location.origin.includes("5173")
  ? "http://127.0.0.1:3000"
  : location.origin;
export default axios.create({
  baseURL: baseUrl,
});

export const remoteApi = axios.create({
    baseURL: 'https://sprintet.onrender.com'
})
