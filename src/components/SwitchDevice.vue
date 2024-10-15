<script setup lang="ts">
import type { SwitchDeviceControl } from './debmatic_api';

const device = defineModel<SwitchDeviceControl>("device");

</script>

<template>
    <v-switch v-model="device.value" :label="device.name" color="primary"></v-switch>
</template>