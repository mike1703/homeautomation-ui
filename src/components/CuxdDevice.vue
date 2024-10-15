<script setup lang="ts">
import type { CuxdDeviceControl } from './debmatic_api';

const device = defineModel<CuxdDeviceControl>("device");

</script>

<template>
    <v-switch v-model="device.value" :label="device.name" color="primary"></v-switch>
</template>