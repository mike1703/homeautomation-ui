<script setup lang="ts">
import type { SwitchDeviceControl } from './debmatic_api';

const devices = defineModel<SwitchDeviceControl[]>("devices");

</script>

<template>
    <v-container>
        <v-row v-for="device in devices">
            <v-switch v-model="device.value" :label="device.name" color="primary"></v-switch>
        </v-row>
    </v-container>
</template>