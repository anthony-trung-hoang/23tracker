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

const cardContent = computed(() => store.vietNamStatistics);
const worldStats = computed(() => store.worldStatistics);
const base64Image = computed(() => imageStore.chartImage);

function convertToNumber(str) {
  if (!str) return 0;
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

watchEffect(() => {
  cardTitles.value = [
    { [t("vietnamData.totalCases")]: cardContent.value.cases },
    { [t("vietnamData.newCases")]: cardContent.value.new_cases },
    { [t("vietnamData.totalDeaths")]: cardContent.value.deaths },
    { [t("vietnamData.newDeaths")]: cardContent.value.new_deaths },
    { [t("vietnamData.totalRecovered")]: cardContent.value.total_recovered },
    { [t("vietnamData.activeCases")]: cardContent.value.active_cases },
    { [t("vietnamData.seriousCritical")]: cardContent.value.serious_critical },
    {
      [t("vietnamData.totalCasesPerMillion")]:
        cardContent.value.total_cases_per_1m_population,
    },
    {
      [t("vietnamData.deathsPerMillion")]:
        cardContent.value.deaths_per_1m_population,
    },
  ];
});

watchEffect(() => {
  timeStamp.value = worldStats.value.statistic_taken_at;
});

const emitter = inject("emitter");

function exportFile() {
  emitter.emit("capture-image");

  setTimeout(() => {
    let data = {
      sheetTitle: t("vietnamData.sheetExport.sheetTitle"),
      titleCell: t("vietnamData.sheetExport.titleCell"),
      script:
        t("vietnamData.sheetExport.script1") +
        timeStamp.value +
        t("vietnamData.sheetExport.script2"),
      desCell: t("vietnamData.sheetExport.desCell"),
      columns: [
        { name: t("vietnamData.sheetExport.tableColumns.activeCases") },
        {
          name: t("vietnamData.sheetExport.tableColumns.totalDeathsPer1M"),
        },
        { name: t("vietnamData.sheetExport.tableColumns.newCases") },
        { name: t("vietnamData.sheetExport.tableColumns.newDeaths") },
        {
          name: t("vietnamData.sheetExport.tableColumns.seriousCritical"),
        },
        { name: t("vietnamData.sheetExport.tableColumns.totalCases") },
        {
          name: t("vietnamData.sheetExport.tableColumns.totalCasesPer1M"),
        },
        { name: t("vietnamData.sheetExport.tableColumns.totalDeaths") },
        {
          name: t("vietnamData.sheetExport.tableColumns.totalRecovered"),
        },
      ],
      rows: [
        convertToNumber(cardContent.value.active_cases),
        convertToNumber(cardContent.value.deaths_per_1m_population),
        convertToNumber(cardContent.value.new_cases),
        convertToNumber(cardContent.value.new_deaths),
        convertToNumber(cardContent.value.serious_critical),
        convertToNumber(cardContent.value.cases),
        convertToNumber(cardContent.value.total_cases_per_1m_population),
        convertToNumber(cardContent.value.deaths),
        convertToNumber(cardContent.value.total_recovered),
      ],
      base64Image: base64Image.value,
      timeStamp: timeStamp.value,
      chartCell: t("vietnamData.sheetExport.chartCell"),
      filename: "vietnam-statistics",
    };
    exportExcel(data);
  }, 1000);
}
</script>

<template>
  <div style="padding-top: 20px; padding-bottom: 20px">
    <!-- TITLE OF THE COMPONENT HERE -->
    <h1>{{ t("vietnamData.vietnamData") }}</h1>
    <h3>
      {{ t("vietnamData.lastUpdatedAt") }} <br />
      {{ timeStamp }}
    </h3>

    <!-- DOWNLOAD BUTTON HERE -->
    <a-button @click="exportFile" type="primary" style="margin-bottom: 15px">
      {{ t("vietnamData.exportReport") }}
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
  font-family: "Roboto", sans-serif;
}
</style>
