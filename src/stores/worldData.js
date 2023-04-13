import { ref } from "vue";
import { defineStore } from "pinia";
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

export const useWorldDataStore = defineStore("world-data", () => {
  const worldStatistics = ref({});
  const countriesStatistics = ref([]);
  const vietNamStatistics = ref({});
  async function fetchWorldStatistics() {
    try {
      const response = await axios.get(apiList.getWorldStatistics.endpoint, {
        headers,
      });

      // GET DATA FROM API
      const worldData = response.data.world_total;
      const countriesData = response.data.countries_stat;
      const vietnamData = countriesData.find(
        (country) => country.country_name === "Vietnam"
      );

      // PUT THEM IN STORE
      worldStatistics.value = worldData;
      countriesStatistics.value = countriesData;
      vietNamStatistics.value = vietnamData;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    worldStatistics,
    countriesStatistics,
    vietNamStatistics,
    fetchWorldStatistics,
  };
});
