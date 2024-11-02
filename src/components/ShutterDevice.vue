<script setup lang="ts">
import { set_new_state, type ShutterDeviceControl } from './debmatic_api';
// import { mdiWindowShutterOpen, mdiWindowShutter, mdiWindowShutterAlert } from '@mdi/js';

const props = defineProps<{ device: ShutterDeviceControl }>();

function update(new_value: number) {
  set_new_state(props.device.control_id, new_value);
}
</script>

<template>
  <v-slider min="0" max="1" step="0.2" @update:model-value="update" v-model="device.value" thumb-label color="primary"
    hide-details>
    <template v-slot:append> {{ device.name }} </template>
  </v-slider>
</template>
