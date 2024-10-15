<script setup lang="ts">
import type { ShutterDeviceControl } from './debmatic_api';

const devices = defineModel<ShutterDeviceControl[]>("devices");

</script>

<template>
    <div>
        Shutter
        <div v-for="device in devices">
            <div>{{ device }}</div>
        </div>
    </div>
</template>