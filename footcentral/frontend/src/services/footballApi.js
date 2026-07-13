import axios from "axios";

const footballApi = axios.create({
  baseURL: "https://api.football-data.org/v4",
  headers: {
    "X-Auth-Token": import.meta.env.VITE_FOOTBALL_API_KEY,
  },
});

export default footballApi;