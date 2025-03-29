import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    "Content-type": "application/json"
  }
});
