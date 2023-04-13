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
const vietnamData = computed(() => store.vietNamStatistics);

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
          convertToNumber(vietnamData.value.cases),
          convertToNumber(vietnamData.value.deaths),
          convertToNumber(vietnamData.value.total_recovered),
          convertToNumber(vietnamData.value.new_cases),
          convertToNumber(vietnamData.value.new_deaths),
        ],
      },
    ],
  };
});
</script>

<template>
  <ChartItem :chartData="chartData"></ChartItem>
</template>
