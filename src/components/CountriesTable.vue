<template>
  <div
    :key="$i18n.locale"
    style="background-color: aliceblue; margin-top: 12px"
  >
    <h2 style="font-size: 25px; margin-bottom: 0px; padding: 6px 6px">
      {{ t("countriesStats.countriesTable.title") }}
    </h2>
    <a-table
      :data-source="data"
      :columns="columns"
      :scroll="{ x: 800, y: 300 }"
      :pagination="{ pageSize: 50 }"
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
            Reset
          </a-button>
        </div>
      </template>

      <template #customFilterIcon="{ filtered }">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>

      <template #bodyCell="{ text, column }">
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
              {{ fragment }}
            </mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
      </template>
    </a-table>
  </div>
</template>
<script setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { ref, watchEffect } from "vue";
import { useWorldDataStore } from "../stores/worldData";
import { computed } from "@vue/reactivity";

function convertToNumber(str) {
  if (!str) return 0;
  if (str === "N/A") return -1;
  str = str.replace(/,/g, "");
  return parseInt(str);
}

let compare = (a, b) => {
  let intA = convertToNumber(a);
  let intB = convertToNumber(b);
  return intA - intB;
};

const store = useWorldDataStore();
const { t } = useI18n();

// REACTIVE DATA FOR TABLE
const computedDataForCountries = computed(() => {
  return store.countriesStatistics;
});
const data = ref([]);
watchEffect(() => {
  data.value = computedDataForCountries.value;
});

const searchText = ref("");
const searchedColumn = ref("");
const searchInput = ref();

const columns = computed(() => [
  {
    title: t("countriesStats.countriesTable.columnTitle.name"),
    dataIndex: "country_name",
    key: "country_name",
    width: 110,
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
]);
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
</script>
<style scoped>
.highlight {
  background-color: rgb(105, 255, 255);
  padding: 0px;
}
</style>
