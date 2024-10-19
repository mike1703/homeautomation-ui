<script setup lang="ts">
import type { HeatingDeviceControl } from './debmatic_api';

const props = defineProps<{ device: HeatingDeviceControl }>();
</script>

<template>
  <v-slider min="15" max="30" step="0.5" v-model="device.set_point_value" thumb-label color="primary">
    <template v-slot:append>
      <v-chip>{{ device.temperature_value }} °C</v-chip> {{ device.name }}
    </template>
  </v-slider>
</template>
