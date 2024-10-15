<script setup lang="ts">
import type { HeatingDeviceControl } from './debmatic_api';

const devices = defineModel<HeatingDeviceControl[]>("devices");

</script>

<template>
    <div>
        Heating
        <div v-for="device in devices">
            <div>{{ device }}</div>
        </div>
    </div>
</template>