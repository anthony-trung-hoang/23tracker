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
const world_chart = "world_chart";
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
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
});
</script>

<template>
  <div style="background-color: #f0f8ff; padding: 12px">
    <h2 style="font-size: 25px; padding: 6px 6px">
      {{ t("worldChart.worldBarplot") }}
    </h2>
    <ChartItem :chartData="chartData" :chartId="world_chart"></ChartItem>
  </div>
</template>
