<script setup lang="ts">
import { computed, ref } from 'vue';
import { set_new_state, type GarageDeviceControl } from './debmatic_api';

const props = defineProps<{ device: GarageDeviceControl }>();

const tickLabels = ref({
  0: 'NOP',
  1: 'Auf',
  2: 'Stop',
  3: 'Zu',
  4: 'Lüften',
});

const state = computed(() => {
  if (props.device.value == 0) {
    return "Geschlossen"
  } else if (props.device.value == 1) {
    return "Geöffnet"
  } else if (props.device.value == 2) {
    return "Lüften"
  } else {
    return "Unbekannt"
  }
})

function update(new_value: number) {
  set_new_state(props.device.door_command_id, new_value);
}
</script>

<template>
  <v-slider max="4" step="1" show-ticks="always" @update:model-value="update" v-model="device.command_value"
    :ticks="tickLabels" color="primary" hide-details>
    <template v-slot:append>
      <v-chip>{{ state }}</v-chip> {{ device.name }}
    </template></v-slider>
</template>
