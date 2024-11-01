<script setup lang="ts">
import { set_new_state, type HeatingDeviceControl } from './debmatic_api';

const props = defineProps<{ device: HeatingDeviceControl }>();

function update(new_value: number) {
  set_new_state(props.device.control_id, new_value);
}
</script>

<template>
  <v-slider min="15" max="30" step="0.5" @update:model-value="update" v-model="device.set_point_value"
    thumb-label="always" color="primary">
    <template v-slot:append>
      <v-chip>{{ device.temperature_value }} °C</v-chip> {{ device.name }}
    </template>
  </v-slider>
</template>
