import axios from "axios";

const headers = {
  "X-RapidAPI-Key": "671223b19fmsh5500a57e27e473fp1a850ejsnb9d5a49074e5",
  "X-RapidAPI-Host": "corona-virus-world-and-india-data.p.rapidapi.com",
};

const apiList = {
  getWorldStatistics: {
    endpoint: "https://corona-virus-world-and-india-data.p.rapidapi.com/api",
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
