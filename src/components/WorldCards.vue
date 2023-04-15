<script setup>
import CardItem from "./items/CardItem.vue";
import { useWorldDataStore } from "../stores/worldData";
import { useImageStore } from "../stores/image";
import { useI18n } from "vue-i18n";
import { ref, watchEffect, inject } from "vue";
import { computed } from "@vue/reactivity";
import { exportExcel } from "../services/exportExcelService";

const { t } = useI18n();
const store = useWorldDataStore();
const imageStore = useImageStore();
const cardTitles = ref("");
const timeStamp = ref("");

function convertToNumber(str) {
  if (!str) return 0;
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

const cardContent = computed(() => store.worldStatistics);
const base64Image = computed(() => imageStore.chartImage);

watchEffect(() => {
  cardTitles.value = [
    { [t("worldData.totalCases")]: cardContent.value.total_cases },
    { [t("worldData.newCases")]: cardContent.value.new_cases },
    { [t("worldData.totalDeaths")]: cardContent.value.total_deaths },
    { [t("worldData.newDeaths")]: cardContent.value.new_deaths },
    { [t("worldData.totalRecovered")]: cardContent.value.total_recovered },
    { [t("worldData.activeCases")]: cardContent.value.active_cases },
    { [t("worldData.seriousCritical")]: cardContent.value.serious_critical },
    {
      [t("worldData.totalCasesPerMillion")]:
        cardContent.value.total_cases_per_1m_population,
    },
    {
      [t("worldData.deathsPerMillion")]:
        cardContent.value.deaths_per_1m_population,
    },
  ];
});

watchEffect(() => {
  timeStamp.value = cardContent.value.statistic_taken_at;
});

const emitter = inject("emitter");

function exportFile() {
  emitter.emit("capture-image");

  setTimeout(() => {
    let data = {
      sheetTitle: t("worldData.sheetExport.sheetTitle"),
      titleCell: t("worldData.sheetExport.titleCell"),
      script:
        t("worldData.sheetExport.script1") +
        timeStamp.value +
        t("worldData.sheetExport.script2"),
      desCell: t("worldData.sheetExport.desCell"),
      columns: [
        { name: t("worldData.sheetExport.tableColumns.activeCases") },
        {
          name: t("worldData.sheetExport.tableColumns.totalDeathsPer1M"),
        },
        { name: t("worldData.sheetExport.tableColumns.newCases") },
        { name: t("worldData.sheetExport.tableColumns.newDeaths") },
        {
          name: t("worldData.sheetExport.tableColumns.seriousCritical"),
        },
        { name: t("worldData.sheetExport.tableColumns.totalCases") },
        {
          name: t("worldData.sheetExport.tableColumns.totalCasesPer1M"),
        },
        { name: t("worldData.sheetExport.tableColumns.totalDeaths") },
        {
          name: t("worldData.sheetExport.tableColumns.totalRecovered"),
        },
      ],
      rows: [
        convertToNumber(cardContent.value.active_cases),
        convertToNumber(cardContent.value.deaths_per_1m_population),
        convertToNumber(cardContent.value.new_cases),
        convertToNumber(cardContent.value.new_deaths),
        convertToNumber(cardContent.value.serious_critical),
        convertToNumber(cardContent.value.total_cases),
        convertToNumber(cardContent.value.total_cases_per_1m_population),
        convertToNumber(cardContent.value.total_deaths),
        convertToNumber(cardContent.value.total_recovered),
      ],
      base64Image: base64Image.value,
      timeStamp: timeStamp.value,
      chartCell: t("worldData.sheetExport.chartCell"),
      filename: "world-statistics",
    };
    exportExcel(data);
  }, 2000);
}
</script>

<template>
  <div style="padding-top: 20px; padding-bottom: 20px">
    <!-- TITLE OF THE COMPONENT HERE -->
    <h1>{{ t("worldData.worldData") }}</h1>
    <h3>
      {{ t("worldData.lastUpdatedAt") }} <br />
      {{ timeStamp }}
    </h3>

    <!-- DOWNLOAD BUTTON HERE -->
    <a-button @click="exportFile" type="primary" style="margin-bottom: 15px">
      {{ t("worldData.exportReport") }}
    </a-button>

    <!-- CARD DISPLAY HERE -->
    <a-row :gutter="10">
      <CardItem
        v-for="(title, index) in cardTitles"
        :key="index"
        :title="Object.keys(title)[0]"
        :content="Object.values(title)[0]"
      />
    </a-row>
  </div>
</template>

<style scoped>
h1,
h3 {
  color: rgb(255, 255, 255);
  font-family: "Roboto";
}
</style>
