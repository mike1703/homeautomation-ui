<script setup lang="ts">
import type { ShutterDeviceControl } from './debmatic_api';
// import { mdiWindowShutterOpen, mdiWindowShutter, mdiWindowShutterAlert } from '@mdi/js';

const props = defineProps<{ device: ShutterDeviceControl }>();
</script>

<template>
  <v-slider min="0" max="1" step="0.2" v-model="device.value" thumb-label color="primary">
    <template v-slot:append> {{ device.name }} </template>
  </v-slider>
</template>
