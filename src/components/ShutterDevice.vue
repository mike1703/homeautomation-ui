<script setup lang="ts">
import type { ShutterDeviceControl } from './debmatic_api';

const device = defineModel<ShutterDeviceControl>("device");

</script>

<template>
    <v-slider min="0" max="1" step="0.2" thumb-label color="primary">
        <template v-slot:append>
            {{ device.name }}
        </template>
    </v-slider>
</template>