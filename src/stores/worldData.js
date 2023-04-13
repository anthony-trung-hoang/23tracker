import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchWorldDataAPI } from "../services/fetchWorldDataService";

export const useWorldDataStore = defineStore("world-data", () => {
  const worldStatistics = ref({});
  const countriesStatistics = ref([]);
  const vietNamStatistics = ref({});
  async function fetchWorldStatistics() {
    try {
      // GET DATA FROM API
      const apiData = await fetchWorldDataAPI();

      // PUT THEM IN STORE
      worldStatistics.value = apiData.world_total;
      countriesStatistics.value = apiData.countries_stat;
      vietNamStatistics.value = apiData.countries_stat.find(
        (country) => country.country_name === "Vietnam"
      );
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
