import axios from "axios";

const headers = {
  "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
  "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
};

const apiList = {
  getWorldStatistics: {
    endpoint: import.meta.env.VITE_RAPID_API_URL,
    method: "GET",
  },
};

export async function fetchWorldDataAPI() {
  try {
    const response = await axios.get(apiList.getWorldStatistics.endpoint, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
