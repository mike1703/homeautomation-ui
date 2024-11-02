<script setup lang="ts">
import { set_new_state, type SwitchDeviceControl } from './debmatic_api';

const props = defineProps<{ device: SwitchDeviceControl }>();

function update(new_value: boolean | null) {
  set_new_state(props.device.id, new_value);
}
</script>

<template>
  <v-switch @update:model-value="update" v-model="device.value" :label="device.name" color="primary"
    hide-details></v-switch>
</template>
