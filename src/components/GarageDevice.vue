<script setup lang="ts">
import { ref } from 'vue';
import type { GarageDeviceControl } from './debmatic_api';

const props = defineProps<{ device: GarageDeviceControl }>();

const tickLabels = ref({
  0: 'Zu',
  1: 'Lüften',
  2: 'Auf',
});
</script>

<template>
  <v-slider max="2" step="1" show-ticks="always" v-model="device.value" :ticks="tickLabels">{{ device }}</v-slider>
</template>
