<script setup lang="ts">
import type { ShutterDeviceControl } from './debmatic_api';

const devices = defineModel<ShutterDeviceControl[]>("devices");

</script>

<template>
    <v-container>
        <v-row v-for="device in devices">
            <v-slider min="0" max="1" step="0.2" thumb-label color="primary">
                <template v-slot:append>
                    {{ device.name }}
                </template>
            </v-slider>
        </v-row>
    </v-container>
</template>