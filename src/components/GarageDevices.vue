<script setup lang="ts">
import { ref } from 'vue';
import type { GarageDeviceControl } from './debmatic_api';

const devices = defineModel<GarageDeviceControl[]>("devices");

const tickLabels = ref({
    0: 'Zu',
    1: 'Lüften',
    2: 'Auf',
});
</script>

<template>
    <v-container>
        <v-row v-for="device in devices">
            <v-slider max="2" step="1" show-ticks="always" :ticks="tickLabels">{{ device }}</v-slider>
        </v-row>
    </v-container>
</template>