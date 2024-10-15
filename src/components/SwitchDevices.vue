<script setup lang="ts">
import type { SwitchDeviceControl } from './debmatic_api';

const devices = defineModel<SwitchDeviceControl[]>("devices");

</script>

<template>
    <div>
        Switches
        <div v-for="device in devices">
            <div>{{ device }}</div>
        </div>
    </div>
</template>