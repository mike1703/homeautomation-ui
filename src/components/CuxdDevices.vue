<script setup lang="ts">
import type { CuxdDeviceControl } from './debmatic_api';

const devices = defineModel<CuxdDeviceControl[]>("devices");

</script>

<template>
    <div>
        Cuxd
        <div v-for="device in devices">
            <div>{{ device }}</div>
        </div>
    </div>
</template>