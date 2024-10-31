<script setup lang="ts">
import { ref } from 'vue';
import { set_new_state, type GarageDeviceControl } from './debmatic_api';

const props = defineProps<{ device: GarageDeviceControl }>();

const tickLabels = ref({
  0: 'Zu',
  1: 'Lüften',
  2: 'Auf',
});

function update(new_value: number) {
  set_new_state(props.device.door_command_id, new_value);
}
</script>

<template>
  <v-slider max="2" step="1" show-ticks="always" @update:model-value="update" v-model="device.value" :ticks="tickLabels"
    color="primary">{{ device }}</v-slider>
</template>
