<script setup lang="ts">
import { ref } from 'vue';
import type { GarageDeviceControl } from './debmatic_api';

const device = defineModel<GarageDeviceControl>("device");

const tickLabels = ref({
    0: 'Zu',
    1: 'Lüften',
    2: 'Auf',
});
</script>

<template>
    <v-slider max="2" step="1" show-ticks="always" :ticks="tickLabels">{{ device }}</v-slider>
</template>