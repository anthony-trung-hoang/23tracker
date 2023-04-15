<script setup>
const props = defineProps({
  title: String,
  content: String,
});
</script>

<template>
  <a-col :xs="24" :sm="12" :md="8">
    <a-card
      size="small"
      :title="title"
      :bordered="false"
      style="margin-bottom: 10px"
    >
      <p>{{ content }}</p>
    </a-card>
  </a-col>
</template>
