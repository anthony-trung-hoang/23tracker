<script setup>
import ChartItem from "./items/ChartItem.vue";
import { useI18n } from "vue-i18n";
import { ref, watchEffect } from "vue";
import { useWorldDataStore } from "../stores/worldData";
import { computed } from "@vue/reactivity";

const { t } = useI18n();
const store = useWorldDataStore();

function convertToNumber(str) {
  if (!str) return 0;
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

// Get data from store for chart
const worldData = computed(() => store.worldStatistics);

// initial data for chart data
const chartData = ref({
  labels: [
    t("worldChart.totalCases"),
    t("worldChart.totalDeaths"),
    t("worldChart.totalRecovered"),
    t("worldChart.newCases"),
    t("worldChart.newDeaths"),
  ],
  datasets: [{ data: [0, 0, 0, 0, 0] }],
});

watchEffect(() => {
  chartData.value = {
    labels: [
      t("worldChart.totalCases"),
      t("worldChart.totalDeaths"),
      t("worldChart.totalRecovered"),
      t("worldChart.newCases"),
      t("worldChart.newDeaths"),
    ],
    datasets: [
      {
        data: [
          convertToNumber(worldData.value.total_cases),
          convertToNumber(worldData.value.total_deaths),
          convertToNumber(worldData.value.total_recovered),
          convertToNumber(worldData.value.new_cases),
          convertToNumber(worldData.value.new_deaths),
        ],
      },
    ],
  };
});
</script>

<template>
  <ChartItem :chartData="chartData"></ChartItem>
</template>
