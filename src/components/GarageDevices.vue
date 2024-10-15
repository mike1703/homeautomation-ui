<script setup lang="ts">
import type { GarageDeviceControl} from './debmatic_api';

const devices = defineModel<GarageDeviceControl[]>("devices");

</script>

<template>
    <div>
        Garage
        <div v-for="device in devices">
            <div>{{ device }}</div>
        </div>
    </div>
</template>