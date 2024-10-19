<script setup lang="ts">
import type { CuxdDeviceControl } from './debmatic_api';

const props = defineProps<{ device: CuxdDeviceControl }>();
</script>

<template>
  <v-switch v-model="device.value" :label="device.name" color="primary"></v-switch>
</template>
