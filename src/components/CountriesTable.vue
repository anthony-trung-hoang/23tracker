<template>
  <div
    :key="$i18n.locale"
    style="background-color: aliceblue; margin-top: 12px; padding: 12px"
  >
    <h2 style="font-size: 25px">
      {{ t("countriesStats.countriesTable.title") }}
    </h2>
    <a-table
      :data-source="data"
      :columns="columns"
      :scroll="{ x: 800, y: 300 }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>{{ t("countriesStats.countriesTable.columnTitle.name") }}</span>
        </template>
      </template>
      <template
        #customFilterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="t('countriesStats.countriesTable.searchPlaceHolder')"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            {{ t("countriesStats.countriesTable.searchButton") }}
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="handleReset(clearFilters)"
          >
            {{ t("countriesStats.countriesTable.resetButton") }}
          </a-button>
        </div>
      </template>

      <template #customFilterIcon="{ filtered }">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>

      <!-- template of bodycell -->
      <template #bodyCell="{ text, column, record }">
        <!-- display searched data -->

        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
            >
            </mark>
          </template>
        </span>

        <template v-if="column.key === 'action'">
          <span>
            <a-button type="primary" @click="showModal(record)">{{
              t("countriesStats.countriesTable.details")
            }}</a-button>
          </span>
        </template>

        <template v-if="column.key === 'country_name'">
          <span
            style="margin-right: 2px"
            :class="'fi fi-' + getCountryISOCode(record.country_name)"
          >
          </span>
          <span>
            {{ record.country_name }}
          </span>
        </template>
      </template>
    </a-table>
  </div>

  <a-modal
    v-model:visible="visible"
    style="text-align: center"
    :title="modalTitle"
    :footer="null"
    :maskClosable="true"
    :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }"
    :destroyOnClose="true"
  >
    <ChartItem :chartData="chartData" :chartId="country_chart"></ChartItem>
    <a-button block type="primary" @click="exportFile">
      {{ t("countriesStats.countriesTable.downloadExcelButton") }}
    </a-button>
  </a-modal>
</template>
<script setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { ref, watchEffect, inject } from "vue";
import { useImageStore } from "../stores/image";
import { useWorldDataStore } from "../stores/worldData";
import { computed } from "@vue/reactivity";
import ChartItem from "./items/ChartItem.vue";
import flags from "../assets/flag";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { exportExcel } from "../services/exportExcelService";

function convertToNumber(str) {
  if (!str) return 0;
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

function getCountryISOCode(country_name) {
  return flags[country_name].toLowerCase();
}

let compare = (a, b) => {
  let intA = convertToNumber(a);
  let intB = convertToNumber(b);
  return intA - intB;
};

const store = useWorldDataStore();
const imageStore = useImageStore();
const { t } = useI18n();

// TIME WHEN STATS WAS TAKEN
const timeStamp = ref("");
const worldData = computed(() => store.worldStatistics);
watchEffect(() => {
  timeStamp.value = worldData.value.statistic_taken_at;
});

// REACTIVE DATA FOR TABLE
const computedDataForCountries = computed(() => {
  return store.countriesStatistics;
});
const data = ref([]);
watchEffect(() => {
  data.value = computedDataForCountries.value;
});
// END DECLARING REACTIVE DATA FOR TABLE

const searchText = ref("");
const searchedColumn = ref("");
const searchInput = ref();

// FOR MODAL SHOW
const modalRecord = ref({});
const modalTitle = ref("");
const visible = ref(false);
const showModal = (record) => {
  visible.value = true;
  modalRecord.value = record;
  modalTitle.value = record.country_name;
};

// initial data for chart data
const country_chart = "country_chart";
const chartData = ref({
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
        convertToNumber(modalRecord.value.cases),
        convertToNumber(modalRecord.value.deaths),
        convertToNumber(modalRecord.value.total_recovered),
        convertToNumber(modalRecord.value.new_cases),
        convertToNumber(modalRecord.value.new_deaths),
      ],
    },
  ],
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
          convertToNumber(modalRecord.value.cases),
          convertToNumber(modalRecord.value.deaths),
          convertToNumber(modalRecord.value.total_recovered),
          convertToNumber(modalRecord.value.new_cases),
          convertToNumber(modalRecord.value.new_deaths),
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

// COLUMNS FOR TABLE
const columns = computed(() => [
  {
    title: t("countriesStats.countriesTable.columnTitle.name"),
    dataIndex: "country_name",
    key: "country_name",
    width: 130,
    customFilterDropdown: true,
    onFilter: (value, record) =>
      record.country_name
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: t("countriesStats.countriesTable.columnTitle.cases"),
    dataIndex: "cases",
    width: 110,
    sorter: {
      compare: (a, b) => compare(a.cases, b.cases),
    },
    sortDirections: ["descend", "ascend"],
  },
  {
    title: t("countriesStats.countriesTable.columnTitle.deaths"),
    dataIndex: "deaths",
    key: "deaths",
    width: 110,
    sorter: {
      compare: (a, b) => compare(a.deaths, b.deaths),
    },
    sortDirections: ["descend", "ascend"],
  },
  {
    title: t("countriesStats.countriesTable.columnTitle.recovered"),
    dataIndex: "total_recovered",
    key: "total_recovered",
    width: 130,
    sorter: {
      compare: (a, b) => compare(a.total_recovered, b.total_recovered),
    },

    sortDirections: ["descend", "ascend"],
  },
  {
    title: t("countriesStats.countriesTable.columnTitle.newDeaths"),
    dataIndex: "new_deaths",
    width: 110,
    key: "new_deaths",
    sorter: {
      compare: (a, b) => compare(a.new_deaths, b.new_deaths),
    },

    sortDirections: ["descend", "ascend"],
  },
  {
    title: t("countriesStats.countriesTable.columnTitle.newCases"),
    dataIndex: "new_cases",
    width: 110,
    key: "new_cases",
    sorter: {
      compare: (a, b) => compare(a.new_cases, b.new_cases),
    },

    sortDirections: ["descend", "ascend"],
  },
  {
    title: t("countriesStats.countriesTable.columnTitle.critical"),
    dataIndex: "serious_critical",
    width: 110,
    key: "serious_critical",
    sorter: {
      compare: (a, b) => compare(a.serious_critical, b.serious_critical),
    },

    sortDirections: ["descend", "ascend"],
  },
  {
    title: t("countriesStats.countriesTable.columnTitle.active"),
    dataIndex: "active_cases",
    key: "active_cases",
    width: 110,
    sorter: {
      compare: (a, b) => compare(a.active_cases, b.active_cases),
    },

    sortDirections: ["descend", "ascend"],
  },
  {
    title: t("countriesStats.countriesTable.columnTitle.tests"),
    dataIndex: "total_tests",
    key: "total_tests",
    width: 110,
    sorter: {
      compare: (a, b) => compare(a.total_tests, b.total_tests),
    },

    sortDirections: ["descend", "ascend"],
  },
  {
    title: t("countriesStats.countriesTable.columnTitle.actions"),
    key: "action",
    width: 110,
  },
]);

// Search and reset for table
const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  searchText.value = selectedKeys[0];
  searchedColumn.value = dataIndex;
};
const handleReset = (clearFilters) => {
  clearFilters({
    confirm: true,
  });
  searchText.value = "";
};

// excel export (through button in the modal)
const base64Image = computed(() => imageStore.chartImage);
const emitter = inject("emitter");

function exportFile() {
  emitter.emit("capture-image");
  setTimeout(() => {
    let data = {
      sheetTitle: `${modalRecord.value.country_name} sheet`,
      titleCell: modalRecord.value.country_name,
      script:
        t("countriesStats.sheetExport.script1") +
        timeStamp.value +
        t("countriesStats.sheetExport.script2"),
      desCell: t("countriesStats.sheetExport.desCell"),
      columns: [
        { name: t("countriesStats.sheetExport.tableColumns.activeCases") },
        {
          name: t("countriesStats.sheetExport.tableColumns.totalDeathsPer1M"),
        },
        { name: t("countriesStats.sheetExport.tableColumns.newCases") },
        { name: t("countriesStats.sheetExport.tableColumns.newDeaths") },
        {
          name: t("countriesStats.sheetExport.tableColumns.seriousCritical"),
        },
        { name: t("countriesStats.sheetExport.tableColumns.totalCases") },
        {
          name: t("countriesStats.sheetExport.tableColumns.totalCasesPer1M"),
        },
        { name: t("countriesStats.sheetExport.tableColumns.totalDeaths") },
        {
          name: t("countriesStats.sheetExport.tableColumns.totalRecovered"),
        },
      ],
      rows: [
        convertToNumber(modalRecord.value.active_cases),
        convertToNumber(modalRecord.value.deaths_per_1m_population),
        convertToNumber(modalRecord.value.new_cases),
        convertToNumber(modalRecord.value.new_deaths),
        convertToNumber(modalRecord.value.serious_critical),
        convertToNumber(modalRecord.value.cases),
        convertToNumber(modalRecord.value.total_cases_per_1m_population),
        convertToNumber(modalRecord.value.deaths),
        convertToNumber(modalRecord.value.total_recovered),
      ],
      base64Image: base64Image.value,
      timeStamp: timeStamp.value,
      chartCell: t("countriesStats.sheetExport.chartCell"),
      filename: `${modalRecord.value.country_name}`,
    };
    exportExcel(data);
  }, 1000);
}
</script>
