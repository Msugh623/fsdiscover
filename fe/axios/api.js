import axios from "axios";

// Run "npm start" in ../../ to get host origin for use in development
export const baseUrl = location.origin.includes("5173")
  ? "http://10.112.247.131:3001"
  : location.origin;
export default axios.create({
  baseURL: baseUrl,
});
